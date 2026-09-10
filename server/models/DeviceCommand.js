const mongoose = require('mongoose');

const deviceCommandSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true,
  },
  command: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DeviceCommand', deviceCommandSchema);
