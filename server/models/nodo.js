const { default: mongoose } = require('mongoose');

const datosDb = mongoose.model('datos', new mongoose.Schema({
    nodo: String,
    temp: String,
    hum: String,
    ppm: String,
  },{
    versionKey: false,
    timestamps: true
  }))
  
  module.exports = datosDb;