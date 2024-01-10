#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Keypad.h>
#include <Servo.h>
#include <SoftwareSerial.h>
#include "DHT.h"
#include <Stepper.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Bounce2.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define SS_PIN 10
#define RST_PIN 9

LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo servo;
DHT dht(24, DHT11);

const int servoPin = 6;
const int buttonPin = 22;
int flame = 8;
int flameLast;  
int sirensPin = 7;
int sirensStatus = false;
boolean servoActivated = false;
int fanPin = 23;
String passwordMfrc522 = "67911b2e";

//set time
const long interval = 5000; 
unsigned long previousMillis = 0;

MFRC522 mfrc522(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);  
  pinMode(buttonPin, INPUT);
  servo.attach(servoPin);
  pinMode(flame, INPUT);
  pinMode(sirensPin, OUTPUT); 
  pinMode(fanPin, OUTPUT);        
  lcd.init();
  lcd.backlight();
  lcd.begin(16, 2);
  lcd.print("Smart Office!");
  delay(2000);
  
  lcd.clear();
  lcd.print("Xin moi");
  lcd.setCursor(0, 1);
  lcd.print("Quet the...");
  delay(1500);
  dht.begin();
  
  lcd.clear();
  
  SPI.begin();
  mfrc522.PCD_Init();
}

void loop() {
  int flameDetected = digitalRead(flame);
  int h = dht.readHumidity();
  float t = dht.readTemperature();

  if(t >=  28) {
    turnOnFan();
  }else {
    turnOffFan();
  }
  if (Serial.available()) {
    String data = "";
    while(Serial.available() ) {
      data = Serial.readStringUntil('\n');
    }
    Serial.println(data);
    processSerialData(data);
  }
  sirensFlame(flameDetected);

  int buttonState = digitalRead(buttonPin);
  
  if (buttonState == HIGH && servoActivated) {
    gradualCloseDoor();
    servoActivated = false;
    lcd.clear();
    lcd.print("Dang Dong cua...");
    delay(1500);
  } 
  else if (buttonState == HIGH && !servoActivated) {
    gradualOpenDoor();
    servoActivated = true;
    lcd.clear();
    lcd.print("Dang mo cua...");
    delay(1500);
  }

  readMfrc522();

  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= interval) {
    String sendData =String(t) + "," + String(h) + "," + String(sirensStatus) + "," + String(servoActivated);
    Serial.println(sendData);
    previousMillis = currentMillis;
  }
}
void sirensFlame(int flameDetected) {
  if(flameDetected == LOW) {
    digitalWrite(sirensPin, HIGH);
    sirensStatus = false;
    delay(100);
  } else if(flameDetected == HIGH){
    digitalWrite(sirensPin, LOW);
    sirensStatus = true;
    delay(100);
  }
}
//handle pan
void turnOnFan() {
  digitalWrite(fanPin, HIGH);
}

void turnOffFan() {
  digitalWrite(fanPin, LOW);
}
void toggleDoor() {
  if (!gradualOpenDoor) {
    gradualOpenDoor();
      servoActivated = true; 
  } else {
    gradualCloseDoor();
      servoActivated = false; 
  }
}
void gradualOpenDoor() {
  int targetServoPosition = 170;  
  int currentServoPosition = servo.read();

  while (currentServoPosition < targetServoPosition) {
    currentServoPosition += 1;
    servo.write(currentServoPosition);
    delay(10);
  }
}

void gradualCloseDoor() {
  int targetServoPosition = 65;   
  int currentServoPosition = servo.read();

  while (currentServoPosition > targetServoPosition) {
    currentServoPosition -= 1;
    servo.write(currentServoPosition);
    delay(10);
  }
}

void processSerialData(String data) {
  if (data == "1" && !servoActivated) {
    gradualOpenDoor();
      delay(1000);
    servoActivated = true;
    lcd.clear();
    lcd.print("Dang mo cua...");
    delay(1500);
  } else if (data == "0" && servoActivated) {
    gradualCloseDoor();
      delay(1000);
    servoActivated = false;
    lcd.clear();
    lcd.print("Dang Dong cua...");
    delay(1500);
  }
}

void readMfrc522() {
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    
    String uid = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      uid += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
      uid += String(mfrc522.uid.uidByte[i], HEX);
    }
    
    mfrc522.PICC_HaltA();
    
    if (uid == passwordMfrc522) {

     gradualOpenDoor();
      servoActivated = true; 
    }
  }
}