export const currentBatch = {
  id: 'BATCH-007',
  startDate: '2026-09-06',
  startTime: '06:30 AM',
  material: 'Sandalwood Agarbatti',
  quantity: 500,
  targetMoisture: 8,
  currentMoisture: 22,
  status: 'drying',
  elapsed: 135,
  estimatedRemaining: 65,
};

export const sensorData = {
  temperature: 47.3,
  humidity: 58.2,
  batteryLevel: 82,
  solarPower: 14.6,
  fanSpeed: 85,
  heaterPower: 60,
  airflow: 3.2,
};

export const dryingHistory = [
  { time: '06:30', temp: 28, humidity: 78, moisture: 45 },
  { time: '07:00', temp: 32, humidity: 74, moisture: 40 },
  { time: '07:30', temp: 36, humidity: 71, moisture: 36 },
  { time: '08:00', temp: 39, humidity: 68, moisture: 33 },
  { time: '08:30', temp: 41, humidity: 65, moisture: 30 },
  { time: '09:00', temp: 43, humidity: 63, moisture: 28 },
  { time: '09:30', temp: 45, humidity: 61, moisture: 25 },
  { time: '10:00', temp: 46, humidity: 60, moisture: 23 },
  { time: '10:30', temp: 47, humidity: 58, moisture: 22 },
  { time: '11:00', temp: null, humidity: null, moisture: null },
  { time: '11:30', temp: null, humidity: null, moisture: null },
  { time: '12:00', temp: null, humidity: null, moisture: null },
  { time: '12:30', temp: null, humidity: null, moisture: null },
  { time: '13:00', temp: null, humidity: null, moisture: null },
];

export const solarHistory = [
  { time: '06:00', power: 2.1, battery: 45 },
  { time: '07:00', power: 5.8, battery: 52 },
  { time: '08:00', power: 9.2, battery: 61 },
  { time: '09:00', power: 12.5, battery: 70 },
  { time: '10:00', power: 14.8, battery: 78 },
  { time: '10:30', power: 14.6, battery: 82 },
  { time: '11:00', power: 15.1, battery: 85 },
  { time: '12:00', power: 15.8, battery: 90 },
  { time: '13:00', power: 14.2, battery: 93 },
  { time: '14:00', power: 11.5, battery: 95 },
  { time: '15:00', power: 7.3, battery: 93 },
  { time: '16:00', power: 3.8, battery: 90 },
  { time: '17:00', power: 1.2, battery: 87 },
];

export const batchHistory = [
  {
    id: 'BATCH-001',
    date: '2026-08-28',
    material: 'Charcoal Classic',
    quantity: 450,
    dryingTime: 4.2,
    finalMoisture: 7.8,
    status: 'completed',
    quality: 'A',
  },
  {
    id: 'BATCH-002',
    date: '2026-08-29',
    material: 'Rose Premium',
    quantity: 300,
    dryingTime: 3.8,
    finalMoisture: 8.1,
    status: 'completed',
    quality: 'A+',
  },
  {
    id: 'BATCH-003',
    date: '2026-08-30',
    material: 'Lavender Organic',
    quantity: 600,
    dryingTime: 5.1,
    finalMoisture: 7.5,
    status: 'completed',
    quality: 'A',
  },
  {
    id: 'BATCH-004',
    date: '2026-09-01',
    material: 'Sandalwood Premium',
    quantity: 400,
    dryingTime: 4.5,
    finalMoisture: 8.3,
    status: 'completed',
    quality: 'B+',
  },
  {
    id: 'BATCH-005',
    date: '2026-09-03',
    material: 'Mixed Herbal',
    quantity: 550,
    dryingTime: 4.8,
    finalMoisture: 7.2,
    status: 'completed',
    quality: 'A',
  },
  {
    id: 'BATCH-006',
    date: '2026-09-04',
    material: 'Jasmine Gold',
    quantity: 350,
    dryingTime: 3.5,
    finalMoisture: 8.5,
    status: 'completed',
    quality: 'A+',
  },
  {
    id: 'BATCH-007',
    date: '2026-09-06',
    material: 'Sandalwood Agarbatti',
    quantity: 500,
    dryingTime: null,
    finalMoisture: null,
    status: 'drying',
    quality: null,
  },
];

export const packagingStats = {
  totalPacked: 2650,
  todayPacked: 0,
  pendingPacking: 0,
  lastBatchPacked: 'BATCH-006',
  avgPackingTime: 3.2,
  materialTypes: [
    { name: 'Kraft Paper', count: 1200 },
    { name: 'Premium Foil', count: 800 },
    { name: 'Eco-Friendly', count: 650 },
  ],
};

export const systemAlerts = [
  { id: 1, type: 'info', message: 'Batch-007 drying in progress', time: '10:30 AM' },
  { id: 2, type: 'success', message: 'Solar charging at optimal level', time: '10:00 AM' },
  { id: 3, type: 'warning', message: 'Humidity slightly above target', time: '09:45 AM' },
  { id: 4, type: 'info', message: 'Fan speed adjusted to 85%', time: '09:30 AM' },
  { id: 5, type: 'success', message: 'Battery level above 80%', time: '09:00 AM' },
];

export const weeklyProduction = [
  { day: 'Mon', batches: 2, quantity: 750 },
  { day: 'Tue', batches: 1, quantity: 300 },
  { day: 'Wed', batches: 2, quantity: 1050 },
  { day: 'Thu', batches: 1, quantity: 400 },
  { day: 'Fri', batches: 1, quantity: 550 },
  { day: 'Sat', batches: 1, quantity: 350 },
  { day: 'Sun', batches: 0, quantity: 0 },
];
