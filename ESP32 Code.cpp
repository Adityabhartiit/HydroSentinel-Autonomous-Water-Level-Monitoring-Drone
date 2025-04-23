#define BLYNK_TEMPLATE_ID "YourTemplateID"
#define BLYNK_DEVICE_NAME "YourDeviceName"
#define BLYNK_AUTH_TOKEN "YourAuthToken"

#include <WiFi.h>
#include <BlynkSimpleEsp32.h>

char ssid[] = "YourWiFiSSID";
char pass[] = "YourWiFiPassword";

#define RXD2 16  // Connect to Arduino TX
#define TXD2 17  // Connect to Arduino RX

float distance, temperature, humidity;

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2); // Software serial to Arduino

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);
}

void loop() {
  Blynk.run();

  if (Serial2.available()) {
    String line = Serial2.readStringUntil('\n');
    line.trim();  // Remove any trailing newline or space

    Serial.print("Received line: ");
    Serial.println(line);

    int firstComma = line.indexOf(',');
    int secondComma = line.indexOf(',', firstComma + 1);

    if (firstComma > 0 && secondComma > firstComma) {
      String d = line.substring(0, firstComma);
      String t = line.substring(firstComma + 1, secondComma);
      String h = line.substring(secondComma + 1);

      distance = d.toFloat();
      temperature = t.toFloat();
      humidity = h.toFloat();

      Serial.print("✅ Parsed → Distance: "); Serial.print(distance);
      Serial.print(" cm, Temp: "); Serial.print(temperature);
      Serial.print(" °C, Humidity: "); Serial.print(humidity); Serial.println(" %");

      Blynk.virtualWrite(V0, distance);
      Blynk.virtualWrite(V1, temperature);
      Blynk.virtualWrite(V2, humidity);
    } else {
      Serial.println("⚠ Parsing failed. Check format of received data.");
    }
  }
}