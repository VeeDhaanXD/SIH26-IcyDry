const SensorReading = require('../models/SensorReading');

exports.create = async (req, res) => {
  try {
    const data = req.body;

    console.log("ESP32 DATA:");
    console.log(data);

    const sensorPayload = {
      deviceId: data.deviceId,
      batchId: data.batchId,
      temperature: data.temperature,
      humidity: data.humidity,
      fanSpeed: data.fanSpeed,
      heaterStatus: data.heaterStatus,
      systemMode: data.systemMode,
      timestamp: new Date()
    };

    const io = req.app.get('io');
    if (io) {
      io.emit('sensorUpdate', sensorPayload);
    }

    const reading = await SensorReading.create(sensorPayload);

    res.status(201).json({
      success: true,
      message: "Sensor data received",
      data: reading
    });
  } catch (error) {
    console.error("Sensor API error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save sensor data"
    });
  }
};

exports.getLatest = async (req, res) => {
  try {
    const latest = await SensorReading
      .findOne()
      .sort({ timestamp: -1 });

    if (!latest) {
      return res.status(404).json({
        success: false,
        message: "No sensor data available"
      });
    }

    res.json({
      success: true,
      data: latest
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get latest sensor data"
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const readings = await SensorReading
      .find()
      .sort({ timestamp: -1 })
      .limit(100);

    res.json({
      success: true,
      data: readings.reverse()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get sensor history"
    });
  }
};

exports.getByBatch = async (req, res) => {
  try {
    const readings = await SensorReading.find({ batchId: req.params.batchId })
      .sort({ timestamp: 1 });
    res.json({
      success: true,
      data: readings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get batch sensor data"
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await SensorReading.deleteMany({});
    res.json({ message: 'All sensor readings cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete sensor data"
    });
  }
};
