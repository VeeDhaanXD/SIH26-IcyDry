const express = require('express');
const router = express.Router();
const { create, getLatest, getHistory, getByBatch, deleteAll } = require('../controllers/sensorReadingController');

router.post('/', create);
router.get('/latest', getLatest);
router.get('/history', getHistory);
router.get('/batch/:batchId', getByBatch);
router.delete('/', deleteAll);

module.exports = router;
