const mongoose = require('mongoose');

const tempHumiditySchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
});

const TemperatureHumidity = mongoose.model('TemperatureHumidity', tempHumiditySchema);

module.exports = TemperatureHumidity;
