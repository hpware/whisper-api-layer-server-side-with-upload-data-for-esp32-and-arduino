import { $ } from "bun";
import { unlink } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import { UUID } from "uuidjs";

async function fetchOllama(contents: string) {
  try {
    const req = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt: `${contents}, 請依據這個來回答使用者要去幾樓, 並必需只回答該樓層羅馬數字`,
        stream: false
      }),
    });
    const res = await req.json();
    return res.response.replace("\n", "");
  } catch (e) {
    return "Can not process the user's request.";
  }
}

function getIpAddr() : string {
    const nets = networkInterfaces();
    let ipAddr = "127.0.0.1";

    for (const interfaceName of Object.keys(nets)) {
        const interfaces = nets[interfaceName];
        if (!interfaces) continue;
        for (const interface_ of interfaces) {
            if (interface_.family === 'IPv4' && !interface_.internal) {
                ipAddr = interface_.address;
                return ipAddr;
            }
        }
    }
    return ipAddr;
}

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    // Enable CORS
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Handle POST requests for file upload
    if (req.method === "POST") {
      let tempFilePath = "";
      try {
        const formData = await req.formData();
        const audioFile = formData.get("audio") as File;

        if (!audioFile) {
          return Response.json(
            { error: "No audio file provided" },
            { status: 400 },
          );
        }

        // Create unique temp file path
        const uuid = UUID.generate().replace(/[^a-zA-Z0-9]/g, "");

        tempFilePath = `temp_audio_${uuid}.wav`;

        // Save uploaded file
        await Bun.write(tempFilePath, audioFile);

        // Process with Whisper
        const command =
          await $`PYTHONIOENCODING=utf-8 whisper ${tempFilePath} --model small --output_format txt`.text();
        console.log(command);
        // Cleanup temp file
        await unlink(tempFilePath);

        const aioutput = command
          .replace(
            "Detecting language using up to the first 30 seconds. Use `--language` to specify the language",
            "",
          )
          .replace(/Detected language.*/, "")
          .replace(/[.*] /, "");
        const output = await fetchOllama(aioutput);
        console.log(output)
        return new Response(output, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "text/text; charset=utf-8",
          },
        });
      } catch (error) {
        // Ensure temp file cleanup on error
        if (tempFilePath) {
          try {
            await unlink(tempFilePath);
          } catch (cleanupError) {
            console.error("Failed to clean up temp file:", cleanupError);
          }
        }
        return Response.json({ error: error.message }, { status: 500 });
      }
    }

    // Handle GET request for home page
    if (req.method === "GET") {
      return new Response(
        `
                <html>
                    <body>
                        <form action="/" method="POST" enctype="multipart/form-data">
                            <input type="file" name="audio" accept="audio/*">
                            <button type="submit">Transcribe</button>
                        </form>
                    </body>
                </html>
            `,
        {
          headers: {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  },
});

const ipAddr = getIpAddr();

console.log(`伺服器在 http://${ipAddr}:${server.port}`);
