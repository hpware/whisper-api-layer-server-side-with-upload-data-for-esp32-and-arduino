#ifndef CONFIG_H
#define CONFIG_H

// WiFi Credentials
const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";

// API Endpoint
const char* apiEndpoint = "https://your.api.endpoint/record";

// Constants
const int sampleRate = 44100; // Sample rate for audio recording
const int audioBufferSize = 1024; // Size of the audio buffer

#endif // CONFIG_H