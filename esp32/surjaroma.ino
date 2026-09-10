#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"

// =====================================================
// WIFI
// =====================================================

const char* WIFI_SSID = "WaiFaai";
const char* WIFI_PASSWORD = "Vedant@2006";

const char* SERVER_BASE_URL = "http://10.194.48.47:5000";

// =====================================================
// DEVICE
// =====================================================

const char* DEVICE_ID = "SURYAROMA-001";

String batchId = "BATCH-001";

// =====================================================
// DHT11
// =====================================================

#define DHT_PIN 4
#define DHT_TYPE DHT11

DHT dht(DHT_PIN, DHT_TYPE);

// =====================================================
// OUTPUT PINS
// =====================================================

#define FAN_LED_PIN 18
#define HEATER_LED_PIN 19
#define BUZZER_PIN 23

// =====================================================
// LCD
// =====================================================

LiquidCrystal_I2C lcd(0x27, 16, 2);

// =====================================================
// SENSOR VALUES
// =====================================================

float temperature = 0.0;
float humidity = 0.0;

int fanSpeed = 0;
bool heaterStatus = false;

// =====================================================
// SYSTEM STATUS
// =====================================================

String systemMode = "AUTO";

bool highTemperatureAlert = false;
bool highHumidityAlert = false;

// =====================================================
// FORCE SHUTDOWN
// =====================================================

bool forceShutdown = false;
bool buzzerState = false;
unsigned long lastBuzzerToggle = 0;
const unsigned long BUZZER_INTERVAL = 1000;

// =====================================================
// TIMERS
// =====================================================

unsigned long lastSensorRead = 0;
unsigned long lastServerSend = 0;
unsigned long lastCommandCheck = 0;

const unsigned long SENSOR_INTERVAL = 2000;
const unsigned long SEND_INTERVAL = 5000;
const unsigned long COMMAND_INTERVAL = 3000;


// =====================================================
// WIFI CONNECTION
// =====================================================

void connectWiFi() {

  Serial.println();
  Serial.println("Connecting to WiFi...");

  WiFi.mode(WIFI_STA);
  WiFi.disconnect(true);
  delay(100);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;

  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected!");
    Serial.print("ESP32 IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("WiFi connection failed.");
    Serial.print("WiFi status: ");
    Serial.println(WiFi.status());
  }
}


// =====================================================
// LCD STARTUP
// =====================================================

void initializeLCD() {

  lcd.init();
  lcd.backlight();
  lcd.clear();

  lcd.setCursor(0, 0);
  lcd.print("IcyDry");

  lcd.setCursor(0, 1);
  lcd.print("Starting...");

  delay(2000);
  lcd.clear();
}


// =====================================================
// READ DHT11
// =====================================================

bool readSensors() {

  float newHumidity = dht.readHumidity();
  float newTemperature = dht.readTemperature();

  if (isnan(newHumidity) || isnan(newTemperature)) {

    Serial.println("DHT11 ERROR");

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("DHT11 ERROR");
    lcd.setCursor(0, 1);
    lcd.print("Check wiring");

    return false;
  }

  humidity = newHumidity;
  temperature = newTemperature;

  return true;
}


// =====================================================
// AUTOMATIC CONTROL
// =====================================================

void automaticControl() {

  highTemperatureAlert = false;
  highHumidityAlert = false;

  // Skip normal control if force shutdown is active
  if (forceShutdown) {
    return;
  }

  if (temperature > 50.0) {
    highTemperatureAlert = true;
    digitalWrite(BUZZER_PIN, HIGH);
  }

  if (humidity > 75.0) {
    highHumidityAlert = true;
    digitalWrite(BUZZER_PIN, HIGH);
  }

  if (temperature <= 50.0 && humidity <= 75.0) {
    digitalWrite(BUZZER_PIN, LOW);
  }

  if (temperature >= 50.0) {
    heaterStatus = false;
    digitalWrite(HEATER_LED_PIN, LOW);
    fanSpeed = 100;
    digitalWrite(FAN_LED_PIN, HIGH);
    Serial.println("!!! HIGH TEMPERATURE !!!");
  }
  else if (humidity >= 70.0) {
    fanSpeed = 80;
    digitalWrite(FAN_LED_PIN, HIGH);
    heaterStatus = false;
    digitalWrite(HEATER_LED_PIN, LOW);
    Serial.println("!!! HIGH HUMIDITY !!!");
  }
  else {
    if (temperature < 35.0) {
      heaterStatus = true;
      digitalWrite(HEATER_LED_PIN, HIGH);
      fanSpeed = 50;
      digitalWrite(FAN_LED_PIN, HIGH);
    }
    else if (temperature < 45.0) {
      heaterStatus = true;
      digitalWrite(HEATER_LED_PIN, HIGH);
      fanSpeed = 70;
      digitalWrite(FAN_LED_PIN, HIGH);
    }
    else {
      heaterStatus = false;
      digitalWrite(HEATER_LED_PIN, LOW);
      fanSpeed = 80;
      digitalWrite(FAN_LED_PIN, HIGH);
    }
  }
}


// =====================================================
// UPDATE LCD
// =====================================================

void updateLCD() {

  lcd.clear();

  if (forceShutdown) {
    lcd.setCursor(0, 0);
    lcd.print("!! FORCE SHUT !!");
    lcd.setCursor(0, 1);
    lcd.print("Shutdown Active!");
    return;
  }

  lcd.setCursor(0, 0);
  lcd.print("T:");
  lcd.print(temperature, 1);
  lcd.print("C ");
  lcd.print("H:");
  lcd.print(humidity, 0);
  lcd.print("%");

  lcd.setCursor(0, 1);

  if (highTemperatureAlert) {
    lcd.print("HIGH TEMP!");
  }
  else if (highHumidityAlert) {
    lcd.print("HIGH HUMIDITY");
  }
  else {
    lcd.print("F:");
    lcd.print(fanSpeed);
    lcd.print("% ");
    if (heaterStatus) {
      lcd.print("HT:ON");
    } else {
      lcd.print("HT:OFF");
    }
  }
}


// =====================================================
// SEND SENSOR DATA TO NODE SERVER
// =====================================================

void sendSensorData() {

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected.");
    connectWiFi();
    return;
  }

  HTTPClient http;

  String url = String(SERVER_BASE_URL) + "/api/sensors";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  String json = "{";
  json += "\"deviceId\":\"";
  json += DEVICE_ID;
  json += "\",";
  json += "\"batchId\":\"";
  json += batchId;
  json += "\",";
  json += "\"temperature\":";
  json += String(temperature, 2);
  json += ",";
  json += "\"humidity\":";
  json += String(humidity, 2);
  json += ",";
  json += "\"fanSpeed\":";
  json += String(fanSpeed);
  json += ",";
  json += "\"heaterStatus\":";
  json += heaterStatus ? "true" : "false";
  json += ",";
  json += "\"systemMode\":\"";
  json += systemMode;
  json += "\"";
  json += "}";

  Serial.println();
  Serial.println("Sending sensor data:");
  Serial.println(json);

  int responseCode = http.POST(json);

  Serial.print("HTTP Response: ");
  Serial.println(responseCode);

  if (responseCode > 0) {
    String response = http.getString();
    Serial.println("Server response:");
    Serial.println(response);
  } else {
    Serial.print("HTTP Error: ");
    Serial.println(http.errorToString(responseCode));
  }

  http.end();
}


// =====================================================
// CHECK SERVER COMMANDS
// =====================================================

void checkServerCommands() {

  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  HTTPClient http;

  String url =
      String(SERVER_BASE_URL) +
      "/api/devices/" +
      DEVICE_ID +
      "/command";

  http.begin(url);

  int responseCode = http.GET();

  if (responseCode == 200) {

    String response = http.getString();

    Serial.println();
    Serial.println("Command from server:");
    Serial.println(response);

    // FAN
    if (response.indexOf("\"fan\":true") >= 0) {
      digitalWrite(FAN_LED_PIN, HIGH);
      fanSpeed = 100;
      Serial.println("FAN -> ON");
    }

    if (response.indexOf("\"fan\":false") >= 0) {
      digitalWrite(FAN_LED_PIN, LOW);
      fanSpeed = 0;
      Serial.println("FAN -> OFF");
    }

    // HEATER
    if (response.indexOf("\"heater\":true") >= 0) {
      if (temperature < 50.0) {
        digitalWrite(HEATER_LED_PIN, HIGH);
        heaterStatus = true;
        Serial.println("HEATER -> ON");
      }
    }

    if (response.indexOf("\"heater\":false") >= 0) {
      digitalWrite(HEATER_LED_PIN, LOW);
      heaterStatus = false;
      Serial.println("HEATER -> OFF");
    }

    // BUZZER + FORCE SHUTDOWN
    if (response.indexOf("\"buzzer\":true") >= 0) {
      forceShutdown = true;
      lastBuzzerToggle = millis();
      Serial.println("FORCE SHUTDOWN ACTIVATED");
    }

    if (response.indexOf("\"buzzer\":false") >= 0) {
      forceShutdown = false;
      digitalWrite(BUZZER_PIN, LOW);
      buzzerState = false;
      Serial.println("FORCE SHUTDOWN CANCELLED");
    }
  }

  http.end();
}


// =====================================================
// PRINT SENSOR DATA
// =====================================================

void printSensorData() {

  Serial.println();
  Serial.println("==============================");

  Serial.print("Device: ");
  Serial.println(DEVICE_ID);

  Serial.print("Batch: ");
  Serial.println(batchId);

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" C");

  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Fan: ");
  Serial.print(fanSpeed);
  Serial.println(" %");

  Serial.print("Heater: ");
  if (heaterStatus) {
    Serial.println("ON");
  } else {
    Serial.println("OFF");
  }

  if (forceShutdown) {
    Serial.println("STATUS: FORCE SHUTDOWN ACTIVE");
  }

  Serial.print("WiFi: ");
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("CONNECTED");
  } else {
    Serial.println("DISCONNECTED");
  }

  Serial.println("==============================");
}


// =====================================================
// SETUP
// =====================================================

void setup() {

  Serial.begin(115200);
  delay(1000);

  pinMode(FAN_LED_PIN, OUTPUT);
  pinMode(HEATER_LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  digitalWrite(FAN_LED_PIN, LOW);
  digitalWrite(HEATER_LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  dht.begin();

  Wire.begin(21, 22);
  initializeLCD();

  connectWiFi();

  Serial.println();
  Serial.println("==============================");
  Serial.println("       IcyDry ESP32");
  Serial.println("==============================");
}


// =====================================================
// LOOP
// =====================================================

void loop() {

  unsigned long now = millis();

  // ---------------------------------------------------
  // BUZZER TOGGLE (FORCE SHUTDOWN)
  // ---------------------------------------------------

  if (forceShutdown) {
    if (now - lastBuzzerToggle >= BUZZER_INTERVAL) {
      lastBuzzerToggle = now;
      buzzerState = !buzzerState;
      digitalWrite(BUZZER_PIN, buzzerState ? HIGH : LOW);
    }
  }

  // ---------------------------------------------------
  // READ SENSOR
  // ---------------------------------------------------

  if (now - lastSensorRead >= SENSOR_INTERVAL) {
    lastSensorRead = now;

    if (readSensors()) {
      automaticControl();
      updateLCD();
      printSensorData();
    }
  }

  // ---------------------------------------------------
  // SEND DATA TO SERVER
  // ---------------------------------------------------

  if (now - lastServerSend >= SEND_INTERVAL) {
    lastServerSend = now;
    sendSensorData();
  }

  // ---------------------------------------------------
  // CHECK SERVER COMMANDS
  // ---------------------------------------------------

  if (now - lastCommandCheck >= COMMAND_INTERVAL) {
    lastCommandCheck = now;
    checkServerCommands();
  }
}
