/**
 * Example of OTAA device      
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

//variables sensores
SHT21 sht; 
MQ135 gasSensor = MQ135(A0);
int temp;
int hum;
int ppm;

// OTAA credentials
const char *devEui = "70B3D57ED005D277";
const char *appEui = "0000000000000000";
const char *appKey = "0A1A7335F0A459BC9790BF604916F9FB";

const unsigned long interval = 5000;    // 10 s interval to send message
unsigned long previousMillis = 0;  // will store last time message sent
unsigned int counter = 0;     // message counter

char myStr[100];
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

  // Set Data Rate
  lora.setDataRate(SF10BW125);
  lora.setTxPower(15,PA_BOOST_PIN);

  // set channel to random
  lora.setChannel(MULTI);
  
  // Put OTAA Key and DevAddress here
  lora.setDevEUI(devEui);
  lora.setAppEUI(appEui);
  lora.setAppKey(appKey);

  // Join procedure
  bool isJoined;
  do {
    Serial.println("Joining...");
    isJoined = lora.join();
    
    //wait for 10s to try again
    delay(10000);
  }while(!isJoined);
  Serial.println("Joined to network");
}

void loop() {

  temp = sht.getTemperature();  // get Temperature from SHT21
  hum = sht.getHumidity(); // get Humidity from SHT21
  ppm=get_ppm();

  // Check interval overflow
  if(millis() - previousMillis > interval) {
    previousMillis = millis(); 

    sprintf(myStr, "temp:%d-hum:%d-ppm%d", temp,hum,ppm); 

    Serial.print("Sending: ");
    Serial.println(myStr);
    
    lora.sendUplink(myStr, strlen(myStr), 0, 1);
  }

  recvStatus = lora.readData(outStr);
  if(recvStatus) {
    Serial.println(outStr);
  }
  
  // Check Lora RX
  lora.update();
}

int get_ppm(){
  ppm = gasSensor.getPPM();
  return ppm;
}
