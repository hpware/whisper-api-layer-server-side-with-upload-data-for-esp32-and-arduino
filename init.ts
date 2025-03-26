import { $ } from "bun";

async function checkOllamaInstalled(): Promise<boolean> {
    try {
        await $`where ollama`.text();
        return true;
    } catch {
        return false;
    }
}


async function runInit() {
    let dots = '';
    const loadingInterval = setInterval(() => {
        process.stdout.write('\r安裝 Whisper' + dots);
        dots = dots.length >= 5 ? '' : dots + '.';
    }, 500);

    try {
        const downloadWhisper = await $`python -m pip install whisper`.text();
        clearInterval(loadingInterval);
        process.stdout.write('\r安裝 Whisper 完成!\n');
    } catch (error) {
        clearInterval(loadingInterval);
        process.stdout.write('\r安裝失敗\n');
        console.error(error);
    }

    dots = "";
    const installOllama = setInterval(() => {
    process.stdout.write('\r安裝 Gemma3 1B' + dots);
        dots = dots.length >= 5 ? '' : dots + '.';
    }, 500);

    try {
        const dowmloadOllama = await $`ollama pull gemma3:1b`.text();
        clearInterval(installOllama);
        process.stdout.write('\r安裝 Ollama 完成!\n');
    } catch (error) {
        clearInterval(installOllama);
        process.stdout.write('\r安裝失敗 你是不是在安裝 Ollama 時這個終端機就開著了\n');
        console.error(error);
    }
    
}

runInit();