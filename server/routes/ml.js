const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

function toSnakeCase(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const snake = key.replace(/[A-Z]/g, m => '_' + m.toLowerCase());
    result[snake] = value;
  }
  return result;
}

async function callMLAPI(endpoint, data) {
  const response = await fetch(`${ML_API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toSnakeCase(data)),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`ML API error ${response.status}: ${text}`);
  }
  return response.json();
}

router.post('/predict', async (req, res, next) => {
  try {
    const result = await callMLAPI('/api/predict', req.body);
    res.json(result);
  } catch (error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch')) {
      return res.status(503).json({
        error: 'ML API unavailable',
        detail: `Make sure FastAPI is running at ${ML_API_URL}`,
      });
    }
    next(error);
  }
});

router.post('/recommendations', async (req, res, next) => {
  try {
    const result = await callMLAPI('/api/recommendations', req.body);
    res.json(result);
  } catch (error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch')) {
      return res.status(503).json({ error: 'ML API unavailable' });
    }
    next(error);
  }
});

router.get('/status', async (req, res) => {
  try {
    const response = await fetch(`${ML_API_URL}/api/health`);
    if (response.ok) {
      const data = await response.json();
      res.json({ connected: true, mlApi: data });
    } else {
      res.json({ connected: false, error: 'ML API responded with error' });
    }
  } catch {
    res.json({ connected: false, error: 'ML API unreachable' });
  }
});

router.post('/batch-predict', async (req, res, next) => {
  try {
    const { batchId } = req.body;
    if (!batchId) {
      return res.status(400).json({ error: 'batchId required' });
    }

    const SensorReading = require('../models/SensorReading');
    const Batch = require('../models/Batch');

    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    const latestReading = await SensorReading.findOne({ batchId }).sort({ timestamp: -1 });
    if (!latestReading) {
      return res.status(404).json({ error: 'No sensor readings for this batch' });
    }

    const elapsed = Math.round((Date.now() - batch.startTime.getTime()) / 60000);

    const payload = {
      temperature: latestReading.temperature,
      humidity: latestReading.humidity,
      solarIntensity: latestReading.solarIntensity,
      fanSpeed: latestReading.fanSpeed,
      heaterStatus: latestReading.heaterStatus,
      batchWeight: batch.quantity,
      initialMoisture: batch.initialMoisture,
      elapsedTime: elapsed,
      temperatureChange: 0,
      humidityChange: 0,
    };

    const mlResult = await callMLAPI('/api/predict', payload);

    const prediction = await Prediction.create({
      batchId,
      remainingTime: mlResult.remainingTime || 0,
      dryingStage: mlResult.dryingStage || 'UNKNOWN',
      confidence: mlResult.confidence || 0,
      recommendation: {
        action: 'NONE',
        reason: '',
      },
      sensorSnapshot: {
        temperature: latestReading.temperature,
        humidity: latestReading.humidity,
        fanSpeed: latestReading.fanSpeed,
        heaterStatus: latestReading.heaterStatus,
        solarIntensity: latestReading.solarIntensity,
        batteryPercentage: latestReading.batteryPercentage,
        airflow: latestReading.airflow,
      },
    });

    res.json({
      prediction,
      mlRaw: mlResult,
    });
  } catch (error) {
    if (error.message && error.message.includes('ECONNREFUSED')) {
      return res.status(503).json({ error: 'ML API unavailable' });
    }
    next(error);
  }
});

module.exports = router;
