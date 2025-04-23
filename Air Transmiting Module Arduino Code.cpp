#include <SPI.h>
#include <nRF24L01.h>
#include <RF24.h>
#include <DHT.h>

#define DHTPIN 5
#define DHTTYPE DHT11   // Or DHT22

#define TRIG_PIN 7
#define ECHO_PIN 6

RF24 radio(9, 10); // CE, CSN
const byte address[6] = "00001";

DHT dht(DHTPIN, DHTTYPE);

struct SensorData {
  float distance;
  float temperature;
  float humidity;
};

void setup() {
  Serial.begin(9600);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  dht.begin();
  radio.begin();
  radio.openWritingPipe(address);
  radio.setPALevel(RF24_PA_LOW);
  radio.stopListening();
}

float readDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2;
}

void loop() {
  SensorData data;
  data.distance = readDistance();
  data.temperature = dht.readTemperature();
  data.humidity = dht.readHumidity();

  Serial.print("Sending -> ");
  Serial.print("Distance: "); Serial.print(data.distance); Serial.print(" cm, ");
  Serial.print("Temp: "); Serial.print(data.temperature); Serial.print(" °C, ");
  Serial.print("Humidity: "); Serial.print(data.humidity); Serial.println(" %");

  radio.write(&data, sizeof(data));

  delay(1000);
}