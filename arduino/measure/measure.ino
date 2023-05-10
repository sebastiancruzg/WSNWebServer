#include <SHT21.h>
#include <MQ135.h>

SHT21 sht; 
MQ135 gasSensor = MQ135(A0);

float temp;
float hum;

void setup() {
  Serial.begin(9600);
  
  Wire.begin();	

  float rzero = gasSensor.getRZero();
  Serial.print("MQ135 RZERO Calibration Value : ");
  Serial.println(rzero);
}

void loop() {

  //gas//
///////////////////////////////////////////////////////////////////////////////////////////////////////////
  float rzero = gasSensor.getRZero();
  //Serial.print("MQ135 RZERO Calibration Value : ");
  //Serial.println(rzero);
  float ppm = gasSensor.getPPM();
  Serial.print("CO2 ppm value : ");
  Serial.println(ppm);

  float sensor_volt;
  float RS_gas; // Get value of RS via in a clear air
  float ratio; // Get ratio RS_GAS/RS air
  float sensorValue=analogRead(A0);
  sensor_volt = sensorValue*(5.0/1024.0);
  RS_gas = (5.0-sensor_volt) / sensor_volt; // omit * RL
  ratio = RS_gas/0.50; //Rs/R0 salido del otro sketch
  //Serial.print("sensor_volt = ");
  //Serial.println(sensor_volt);
  //Serial.print("ratio = ");
  //Serial.println(ratio);
  Serial.print("sensorValue = ");
  Serial.println(sensorValue );
///////////////////////////////////////////////////////////////////////////////////////////////////////////  
  
  //temperatura y humedad//
///////////////////////////////////////////////////////////////////////////////////////////////////////////
  //temp = sht.getTemperature();  // get Temperature from SHT21
  //hum = sht.getHumidity(); // get Humidity from SHT21
  //Serial.print("Temp: ");			// print readings
  //Serial.print(temp);
  //Serial.print("\t Humidity: ");
  //Serial.println(hum);

  delay(3000);

}