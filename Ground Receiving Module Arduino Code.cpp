#include <SoftwareSerial.h>
#include <SPI.h>
#include <RF24.h>

struct SensorData {
  float distance;
  float temperature;
  float humidity;
};

RF24 radio(9, 10); // CE, CSN
const byte address[6] = "00001";

SoftwareSerial espSerial(2, 3); // RX, TX (connect to ESP32)

void setup() {
  Serial.begin(9600);
  espSerial.begin(9600);

  radio.begin();
  radio.openReadingPipe(0, address);
  radio.setPALevel(RF24_PA_LOW);
  radio.startListening();
}

void loop() {
  if (radio.available()) {
    SensorData data;
    radio.read(&data, sizeof(data));

    // Debug to Serial Monitor
    Serial.println("Received Sensor Data:");
    Serial.print("Distance: "); Serial.print(data.distance); Serial.println(" cm");
    Serial.print("Temperature: "); Serial.print(data.temperature); Serial.println(" °C");
    Serial.print("Humidity: "); Serial.print(data.humidity); Serial.println(" %");
    Serial.println("------------------------");

    // Send only CSV line to ESP32
    espSerial.print(data.distance); espSerial.print(",");
    espSerial.print(data.temperature); espSerial.print(",");
    espSerial.println(data.humidity); // ends with newline
  }
}