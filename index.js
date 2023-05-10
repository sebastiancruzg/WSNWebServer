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

const topic0 = 'enthu/260B8E5D/data'
const topic1 = 'enthu/260BF6C8/data'

client.on('connect', () => {
  console.log('Connected')

  client.subscribe([topic0], () => {
    console.log(`Subscribe to topic '${topic0}'`)
  })

  client.subscribe([topic1], () => {
    console.log(`Subscribe to topic '${topic1}'`)
  })

  client.publish(topic0, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })

  client.publish(topic1, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })

})

let nodo
let temp
let hum 
let ppm

client.on('message', (topic, payload) => {
  let result= "";
  payload = payload.toString();

  for (let i = 0; i < payload.length; i += 2) {
    let code = parseInt(payload.substr(i, 2), 16);
    result += String.fromCharCode(code);
  }

  const array = result.split("/");
  nodo = array[1];
  temp = array[2];
  hum = array[3];
  ppm = array[4];
  console.log(nodo,temp,hum,ppm);

})

app.use(cors());

// Ruta HTTP para recibir la solicitud y enviar la respuesta
app.get('/', (req, res) => {

    res.json({
      "nodo": nodo,
      "temp": temp,
      "hum": hum,
    }); 

});

const portn = 5000;
app.listen(portn,() => {

  console.log(`running on port ${portn}`)
  
})
