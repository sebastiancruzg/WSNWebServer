/**
 * Example of ABP device
 * Authors: 
 *        Ivan Moreno
 *        Eduardo Contreras
 *  June 2019
 * 
 * This code is beerware; if you see me (or any other collaborator 
 * member) at the local, and you've found our code helpful, 
 * please buy us a round!
 * Distributed as-is; no warranty is given.
 */
#include <lorawan.h>
#include <SHT21.h>
#include <MQ135.h>

//ABP Credentials 
const char *devAddr = "260B233B";
const char *nwkSKey = "8132D1B2AEDD38434B5E84EA6533D553";
const char *appSKey = "9A82C5DE4656BC5782AFCE49F62BEA26";

//variables sensores
#define PIN_MQ135 A0
MQ135 mq135_sensor(PIN_MQ135);
SHT21 sht; 
int temp;
int hum;
int ppm;

const unsigned long interval = 5000;    // 10 s interval to send message
unsigned long previousMillis = 0;  // will store last time message sent
unsigned int counter = 0;     // message counter

char myStr[50];
char outStr[255];
byte recvStatus = 0;

const sRFM_pins RFM_pins = {
  .CS = 8,
  .RST = 4,
  .DIO0 = 7,
  .DIO1 = 5,
  .DIO2 = 10,
  .DIO5 = 15,
};

void setup() {
  // Setup loraid access
  Serial.begin(9600);
  while(0);
  if(!lora.init()){
    Serial.println("RFM95 not detected");
    delay(5000);
    return;
  }

  Wire.begin();	

  // Set LoRaWAN Class change CLASS_A or CLASS_C
  lora.setDeviceClass(CLASS_A);

  // Set Tx Power
  lora.setTxPower(0,PA_BOOST_PIN)

  // Set Data Rate
  lora.setDataRate(SF10BW125);

  // set channel to random
  lora.setChannel(MULTI);
  
  // Put ABP Key and DevAddress here
  lora.setNwkSKey(nwkSKey);
  lora.setAppSKey(appSKey);
  lora.setDevAddr(devAddr);
}

void loop() {

  temp = sht.getTemperature();  // get Temperature from SHT21
  hum = sht.getHumidity(); // get Humidity from SHT21
  ppm = mq135_sensor.getPPM(); 
  
  if (ppm>6000){
    ppm = 6000;
  }
  
  if (ppm<0){
    ppm = 0;
  }

  // Check interval overflow
  if(millis() - previousMillis > interval) {
    previousMillis = millis(); 

    sprintf(myStr, "/3/%d/%d/%d", temp,hum,ppm);

    Serial.print("Sending: ");
    Serial.println(myStr);
    
    lora.sendUplink(myStr, strlen(myStr), 0, 1);
    counter++;
  }

  recvStatus = lora.readData(outStr);
  if(recvStatus) {
    Serial.println(outStr);
  }
  
  // Check Lora RX
  lora.update();
}
