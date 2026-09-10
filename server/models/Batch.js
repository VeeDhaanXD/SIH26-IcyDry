const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  product: {
    type: String,
    required: true,
    default: 'Agarbatti',
  },
  quantity: {
    type: Number,
    required: true,
  },
  initialMoisture: {
    type: Number,
    required: true,
  },
  targetMoisture: {
    type: Number,
    default: 8,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['DRYING', 'COMPLETED', 'FAILED'],
    default: 'DRYING',
  },
  finalMoisture: {
    type: Number,
    default: null,
  },
  dryingTime: {
    type: Number,
    default: null,
  },
  qualityScore: {
    type: Number,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);
