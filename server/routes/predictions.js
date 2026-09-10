const express = require('express');
const router = express.Router();
const { create, getByBatch, getLatestByBatch, deleteAll } = require('../controllers/predictionController');

router.post('/', create);
router.get('/batch/:batchId', getByBatch);
router.get('/batch/:batchId/latest', getLatestByBatch);
router.delete('/', deleteAll);

module.exports = router;
