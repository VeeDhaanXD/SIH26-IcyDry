require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

app.set('io', io);

connectDB();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/sensors', require('./routes/sensorReadings'));
app.use('/api/batches', require('./routes/batches'));
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/ml', require('./routes/ml'));
app.use('/api/devices', require('./routes/devices'));

io.on('connection', (socket) => {
  console.log(`Dashboard connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Dashboard disconnected: ${socket.id}`);
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'icydry-node' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`IcyDry Node server running on port ${PORT}`);
});

module.exports = { app, server, io };
