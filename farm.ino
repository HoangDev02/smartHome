#include <ESP8266WiFi.h>
#include <SoftwareSerial.h>
#include <PubSubClient.h>

#define WIFI_SSID "Redmi Note 12"
#define WIFI_PASSWORD "11092002"
const char* mqtt_server = "f63a3874d1364c15ba9d13699c92dc63.s1.eu.hivemq.cloud";
const char* mqtt_username = "esp8266Den";
const char* mqtt_password = "esp8266Den";
const char* mqtt_topic_ButtonFloor = "BUTTONFLOOR";
const char* mqtt_topic_Flame = "FLAME";
const char* mqtt_topic_CTNgu = "CTNgu";
const char* mqtt_topic_DHT_publish = "DHT";
const char* mqtt_topic_led_publish = "LED";
const char* mqtt_topic_led_subscribe = "LED";
const char* mqtt_topic_manually = "MANUALLY";
const char* mqtt_topic_pan = "PAN";

SoftwareSerial megaSerial(0, 1);
WiFiClientSecure espClient;
PubSubClient client(espClient);
int fanPin = D8;
int fanPinLast;
String manuallyState = "OFF";
bool manualFanControl = false; 
int maxDistance = 100;
int prevButtonStateFloor = -1;
int ledPin = 5;
bool ledState = false;
bool ledLast = true;
int pinButtonLed = D0;
int pinButtonLedState;
String lastMessageButtonFloor = "";
const int redPin = 15;
const int greenPin = 13;
const int bluePin = 12;
int redValue;
int greenValue;
int blueValue;
int currentSirensFlame;
bool setColor = false;
bool isSwitchOn = false;
int currentHumidity = 0;
float currentTemperature = 0.0;

void setup() {
  Serial.begin(115200);
  megaSerial.begin(115200);
  pinMode(ledPin, OUTPUT);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  pinMode(pinButtonLed,INPUT);
    pinMode(fanPin, OUTPUT);  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
    // Thiết lập kết nối MQTT
  espClient.setInsecure();
  client.setServer(mqtt_server, 8883);
  client.setCallback(callback);
  while (!client.connected()) {
    Serial.println("Connecting to MQTT broker...");
    if (client.connect("ESP8266Client", mqtt_username, mqtt_password )) {
      Serial.println("Connected to MQTT broker");
      client.subscribe(mqtt_topic_ButtonFloor);
      client.subscribe(mqtt_topic_led_subscribe);
         client.subscribe(mqtt_topic_manually);
      client.subscribe(mqtt_topic_pan);

    } else {
      Serial.print("Failed to connect with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

void loop() {
    client.loop();
  if(ledLast != ledState) {
      ledLast = ledState;
      String LedData = String(ledState);
      client.publish("LED", LedData.c_str());
  }
  pinButtonLedState = digitalRead(pinButtonLed);
  if(pinButtonLedState == HIGH && !ledState) {
    turnOnLED();
    delay(1000);
  } else if(pinButtonLedState == HIGH && ledState) {
    turnOffLED();
    delay(1000);

  }
  if (Serial.available()) {
    String data = Serial.readStringUntil('\n');
    Serial.println(data);
    int comma1 = data.indexOf(',');
    int comma2 = data.indexOf(',', comma1 + 1);
    int comma3 = data.indexOf(',', comma2 + 1);
    if(comma1 != -1 && comma2 != -1 && comma3 != -1) {
      String temperatureStr = data.substring(0, comma1);
      String humidityStr = data.substring(comma1 + 1, comma2);
      String sirensFlame = data.substring(comma2 + 1, comma3);
      String buttonStateFloorStr = data.substring(comma3 + 1);  // Use correct index
      int sirensFlameStr = sirensFlame.toInt();
      int buttonStateFloor = buttonStateFloorStr.toInt();
      float t = temperatureStr.toFloat();
      int h = humidityStr.toInt();
      if(manuallyState == "ON") {
      if (t > 24.0) {  
        turnOnFan();
      } else {
        turnOffFan(); // Tắt quạt nếu nhiệt độ dưới 30 độ
      }
    } else if( manuallyState == "OFF") {
      if (fanPinLast == 1) {  
        turnOnFan();
      } else if (fanPinLast == 0) {
        turnOffFan(); // Tắt quạt nếu nhiệt độ dưới 30 độ
      }
    }
      if (buttonStateFloor != prevButtonStateFloor) {
        String buttonStateFloorTopic =  String(buttonStateFloor);
        client.publish(mqtt_topic_ButtonFloor, buttonStateFloorTopic.c_str());
        prevButtonStateFloor = buttonStateFloor;
      }
       if (sirensFlameStr != currentSirensFlame) {
        currentSirensFlame = sirensFlameStr;
        // You can publish the sensor data to MQTT if needed
        String sensorData =String(currentSirensFlame);
        client.publish(mqtt_topic_Flame, sensorData.c_str());
      }
       if (t != currentTemperature || h != currentHumidity) {
        currentTemperature = t;
        currentHumidity = h;
        // You can publish the sensor data to MQTT if needed
        String sensorData = "Temperature: " + String(t) + "°C, Humidity: " + String(h) + "%";
        client.publish(mqtt_topic_DHT_publish, sensorData.c_str());
      }
    }
  }


}
void handleFanOffManual() {
   manualFanControl = true;
   turnOffFan(); // Turn off fan when manually requested
}
void handleFanOnManual() {
   manualFanControl = false;
   turnOnFan(); // Turn off fan when manually requested
}
//handle LED
void turnOnLED() {
  digitalWrite(ledPin, HIGH);
  ledState = true;
}
void turnOnFan() {
  digitalWrite(fanPin, HIGH);
}

void turnOffFan() {
  digitalWrite(fanPin, LOW);
}

void turnOffLED() {
  digitalWrite(ledPin, LOW);
  ledState = false;
}
void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  // Chuyển payload sang String
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  // Serial.println(message);
    if (String(topic) == mqtt_topic_manually) {
    if (message == "1") {
      manuallyState = "ON";
    } else if (message == "0") {
      manuallyState = "OFF";
    }
  }
    if(String(topic) == mqtt_topic_pan) {
    if (message == "1") {
      fanPinLast = 1;
    } else if (message == "0") {
      fanPinLast = 0;
    }
  }
   if (String(topic) == mqtt_topic_led_publish) {
    if (message == "1") {
      turnOnLED();
    } else if (message == "0") {
      turnOffLED();
    }
  }
   if (String(topic) == mqtt_topic_ButtonFloor) {
    if (message != lastMessageButtonFloor) {
      // megaSerial.print("LEDON");
       if(message == "1") {
        megaSerial.print(message);
      } else if (message == "0") {
        megaSerial.print(message);
      }
      lastMessageButtonFloor = message;
    }
  }
}
