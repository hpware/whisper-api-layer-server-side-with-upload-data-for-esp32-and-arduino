#ifndef I2S_H
#define I2S_H

#include <Arduino.h>

class I2S {
public:
    I2S();
    void begin();
    void startRecording();
    void stopRecording();
    int readAudioData(uint8_t* buffer, size_t length);
    bool isRecording();

private:
    bool recording;
};

#endif // I2S_H