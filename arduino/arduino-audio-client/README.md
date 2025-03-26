# Contents of `README.md`

# Arduino Audio Client

This project is an Arduino application that interfaces with a specified API to record audio using I2C and send the audio data to the API.

## Project Structure

- `src/AudioClient.ino`: Main Arduino sketch file that initializes I2C communication, sets up audio recording using the I2S library, and handles sending recorded audio data to the API over WiFi.
- `src/config.h`: Contains configuration settings such as API endpoint URLs, WiFi credentials, and constants used throughout the application.
- `src/libraries/I2S/I2S.h`: Defines the I2S library interface for handling audio input and output.
- `src/libraries/WiFi/WiFi.h`: Defines the WiFi library interface for connecting to WiFi networks and sending HTTP requests to the API.
- `platformio.ini`: Configuration file for PlatformIO, specifying the board type, framework, and libraries required for the project.

## Setup Instructions

1. Clone the repository to your local machine.
2. Open the project in PlatformIO.
3. Update `src/config.h` with your WiFi credentials and API endpoint.
4. Upload the `AudioClient.ino` sketch to your Arduino board.

## Usage Guidelines

- Ensure your Arduino board is connected to the internet.
- Run the application to start recording audio and sending it to the specified API.

## Dependencies

- I2S library for audio handling.
- WiFi library for network connectivity.

Feel free to modify the project as needed!