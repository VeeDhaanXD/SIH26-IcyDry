const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  remainingTime: {
    type: Number,
    required: true,
  },
  dryingStage: {
    type: String,
    enum: ['INITIAL', 'ACTIVE_DRYING', 'STABILIZING', 'NEAR_COMPLETE', 'COMPLETED'],
    required: true,
  },
  confidence: {
    type: Number,
    default: 0,
  },
  recommendation: {
    action: { type: String, default: 'NONE' },
    targetFanSpeed: { type: Number, default: null },
    targetHeaterStatus: { type: Boolean, default: null },
    reason: { type: String, default: '' },
  },
  sensorSnapshot: {
    temperature: Number,
    humidity: Number,
    fanSpeed: Number,
    heaterStatus: Boolean,
    solarIntensity: Number,
    batteryPercentage: Number,
    airflow: Number,
  },
}, { timestamps: true });

predictionSchema.index({ batchId: 1, timestamp: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
