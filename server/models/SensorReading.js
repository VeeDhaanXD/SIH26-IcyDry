const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    default: 'ICYDRY-001',
    index: true,
  },
  batchId: {
    type: String,
    required: true,
    index: true,
  },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  ambientTemperature: { type: Number, default: 30 },
  solarIntensity: { type: Number, default: 0 },
  fanSpeed: { type: Number, default: 0 },
  heaterStatus: { type: Boolean, default: false },
  batteryPercentage: { type: Number, default: 100 },
  airflow: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now, index: true },
});

sensorReadingSchema.index({ batchId: 1, timestamp: -1 });
sensorReadingSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
