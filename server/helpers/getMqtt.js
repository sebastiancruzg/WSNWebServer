const mqtt = require('mqtt')
const NodoModel = require('../models/nodo')

const getMqtt = ()=>{
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

const topic1 = 'enthu/260B8E5D/data'
const topic2 = 'enthu/260BF6C8/data'
const topic3= 'enthu/260B233B/data'

client.on('connect', () => {
  console.log('Connected')

  client.subscribe([topic1], () => {
    console.log(`Subscribe to topic '${topic1}'`)
  })

  client.subscribe([topic2], () => {
    console.log(`Subscribe to topic '${topic2}'`)
  })

  client.subscribe([topic3], () => {
    console.log(`Subscribe to topic '${topic3}'`)
  })

  client.publish(topic1, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })

  client.publish(topic2, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })

  client.publish(topic3, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
})

let nodo
let temp
let hum 
let ppm

client.on('message', async(topic, payload) => {
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

  const datosMqtt = {
    nodo,
    temp,
    hum,
    ppm
  }

  const newNodoDato = new NodoModel({
    nodo: nodo,
    temp: temp,
    hum: hum,
    ppm: ppm,
  })
  
  if(nodo==1 || nodo==2 || nodo==3){
  const save = await newNodoDato.save();
  }
  
  return datosMqtt

})
}

module.exports={getMqtt};