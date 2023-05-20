const express = require('express')
const cors = require('cors');
const app = express();
const getMqtt = require('./helpers/getMqtt')
const connectDB = require('./config/connectionDB')

const result = getMqtt();
console.log(result);
connectDB();
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

app.get('/db1',async(req, res) => {

  try {
    const result = await  datos.find({ nodo: '1'}).sort({ createdAt:  -1 })
    console.log(result);
    res.json(
      result
    )
  } catch (error) {
    console.error('Error querying datos:', error); 
  }
  
});

app.get('/db2',async(req, res) => {

  try {
    const result = await  datos.find({ nodo: '2'}).sort({ createdAt:  -1 })
    console.log(result);
    res.json(
      result
    )
  } catch (error) {
    console.error('Error querying datos:', error); 
  }
  
});

app.get('/db3',async(req, res) => {

  try {
    const result = await  datos.find({ nodo: '3'}).sort({ createdAt:  -1 })
    console.log(result);
    res.json(
      result
    )
  } catch (error) {
    console.error('Error querying datos:', error); 
  }
  
});

const portn = 5000;
app.listen(portn,() => {

  console.log(`running on port ${portn}`)
  
})
