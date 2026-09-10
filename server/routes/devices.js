const express = require('express');
const router = express.Router();
const { getCommand, sendCommand } = require('../controllers/deviceController');

router.get('/:deviceId/command', getCommand);
router.post('/:deviceId/command', sendCommand);

module.exports = router;
