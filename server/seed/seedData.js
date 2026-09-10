require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const SensorReading = require('../models/SensorReading');
const Batch = require('../models/Batch');
const Prediction = require('../models/Prediction');

const batches = [
  {
    batchId: 'BATCH-001', product: 'Sandalwood Agarbatti', quantity: 1.5,
    initialMoisture: 28.5, targetMoisture: 8,
    startTime: new Date('2026-09-05T06:30:00'), endTime: new Date('2026-09-05T10:45:00'),
    status: 'COMPLETED', finalMoisture: 7.8, dryingTime: 255, qualityScore: 94,
  },
  {
    batchId: 'BATCH-002', product: 'Charcoal Classic', quantity: 2.0,
    initialMoisture: 32.1, targetMoisture: 8,
    startTime: new Date('2026-09-06T07:00:00'), endTime: new Date('2026-09-06T11:30:00'),
    status: 'COMPLETED', finalMoisture: 8.2, dryingTime: 270, qualityScore: 91,
  },
  {
    batchId: 'BATCH-003', product: 'Masala Agarbatti', quantity: 1.8,
    initialMoisture: 35.0, targetMoisture: 8,
    startTime: new Date('2026-09-07T06:30:00'), endTime: null,
    status: 'DRYING', finalMoisture: null, dryingTime: null, qualityScore: null,
  },
];

const sensorReadings = [];

function genReadings(batchId, start, count, initTemp, initHum, fanBase) {
  let temp = initTemp;
  let hum = initHum;
  for (let i = 0; i < count; i++) {
    const ts = new Date(start.getTime() + i * 300000);
    temp += (Math.random() - 0.4) * 1.5;
    hum -= (Math.random() * 0.8 + 0.1);
    temp = Math.max(25, Math.min(55, temp));
    hum = Math.max(20, Math.min(85, hum));

    sensorReadings.push({
      deviceId: 'ICYDRY-001',
      batchId,
      temperature: +temp.toFixed(1),
      humidity: +hum.toFixed(1),
      ambientTemperature: +(30 + (Math.random() - 0.5) * 2).toFixed(1),
      solarIntensity: +(720 + (Math.random() - 0.5) * 100).toFixed(0),
      fanSpeed: Math.min(100, fanBase + Math.floor(Math.random() * 10 - 5)),
      heaterStatus: i < count * 0.6,
      batteryPercentage: +(85 - i * 0.3).toFixed(1),
      airflow: +(2.4 + (Math.random() - 0.5) * 0.3).toFixed(1),
      timestamp: ts,
    });
  }
}

genReadings('BATCH-001', new Date('2026-09-05T06:30:00'), 20, 31, 78, 65);
genReadings('BATCH-002', new Date('2026-09-06T07:00:00'), 22, 33, 80, 70);
genReadings('BATCH-003', new Date('2026-09-07T06:30:00'), 15, 29, 75, 60);

const predictions = [
  {
    batchId: 'BATCH-003',
    remainingTime: 85,
    dryingStage: 'ACTIVE_DRYING',
    confidence: 0.87,
    recommendation: { action: 'INCREASE_FAN', reason: 'Humidity decreasing slower than expected' },
    sensorSnapshot: { temperature: 38.5, humidity: 52.3, fanSpeed: 65, heaterStatus: true, solarIntensity: 710, batteryPercentage: 83, airflow: 2.6 },
  },
  {
    batchId: 'BATCH-003',
    remainingTime: 42,
    dryingStage: 'STABILIZING',
    confidence: 0.91,
    recommendation: { action: 'MAINTAIN', reason: 'Drying on track' },
    sensorSnapshot: { temperature: 43.2, humidity: 38.7, fanSpeed: 70, heaterStatus: true, solarIntensity: 750, batteryPercentage: 81, airflow: 2.8 },
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    await SensorReading.deleteMany({});
    await Batch.deleteMany({});
    await Prediction.deleteMany({});
    console.log('Cleared existing data');

    await Batch.insertMany(batches);
    console.log(`Seeded ${batches.length} batches`);

    await SensorReading.insertMany(sensorReadings);
    console.log(`Seeded ${sensorReadings.length} sensor readings`);

    await Prediction.insertMany(predictions);
    console.log(`Seeded ${predictions.length} predictions`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
