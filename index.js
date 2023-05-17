const mqtt = require('mqtt')
const express = require('express')
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express();
const path = require('path');
const ejs = require('ejs');

app.use(express.static(path.join()));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/wsn')
    console.log(
      `MongoDB Connected: ${conn.connection.host}`
    )
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

const datos = mongoose.model('datos', new mongoose.Schema({
  nodo: String,
  temp: String,
  hum: String,
  ppm: String,
},{
  versionKey: false,
  timestamps: true
}))

connectDB();

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

  const newdatos = new datos({
    nodo: nodo,
    temp: temp,
    hum: hum,
    ppm: ppm,
  })
  
  if(nodo==1 || nodo==2 || nodo==3){
  const save = await newdatos.save();
  }
  console.log(nodo,temp,hum,ppm);
})

app.use(cors());


// Ruta HTTP para recibir la solicitud y enviar la respuesta
app.get('/', (req, res) => {
    res.json({
      "nodo": nodo,
      "temp": temp,
      "hum": hum,
      "ppm": ppm,
    }); 

});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'PagRedes.html'));
});

app.get('/db1',async(req, res) => {

  await datos.find({ nodo: '1'}).sort({ createdAt:  -1 })
  .then((datos) => {
    console.log('datos:', datos);
    res.render('tabla1.ejs', { datos });
    
  })
  .catch((error) => {
    console.error('Error querying datos:', error);
  }); 
  
});

app.get('/db2',async(req, res) => {

  await datos.find({ nodo: '2'}).sort({ createdAt:  -1 })
  .then((datos) => {
    console.log('datos:', datos);
    res.render('tabla2.ejs', { datos });
    
  })
  .catch((error) => {
    console.error('Error querying datos:', error);
  }); 
  
});

app.get('/db3',async(req, res) => {

  await datos.find({ nodo: '3'}).sort({ createdAt:  -1 })
  .then((datos) => {
    console.log('datos:', datos);
    res.render('tabla3.ejs', { datos });
    
  })
  .catch((error) => {
    console.error('Error querying datos:', error);
  }); 
  
});

const portn = 5000;
app.listen(portn,() => {

  console.log(`running on port ${portn}`)
  
})
