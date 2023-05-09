const mqtt = require('mqtt')
const express = require('express')
const cors = require('cors')
const app = express();

const host = 'test.mosquitto.org'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: '',
  password: '',
  reconnectPeriod: 1000,
})

const topic = 'enthu/260B8E5D/data'

client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
  client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
})

let str;

client.on('message', (topic, payload) => {
  let result= "";
  payload = payload.toString();

  for (let i = 0; i < payload.length; i += 2) {
    let code = parseInt(payload.substr(i, 2), 16);
    result += String.fromCharCode(code);
  }
  
  const array = result.split("/");
  temp = array[1];
  hum = array[2];
  ppm = array[3];
  console.log(temp,hum,ppm);

})

app.use(cors());

// Ruta HTTP para recibir la solicitud y enviar la respuesta
app.get('/', (req, res) => {

    res.json({
      "temp": temp,
      "hum": hum,
      "ppm": ppm
    }); 

});

const portn = 5000;
app.listen(portn,() => {

  console.log(`running on port ${portn}`)
  
})
