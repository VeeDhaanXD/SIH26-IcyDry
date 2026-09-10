const DeviceCommand = require('../models/DeviceCommand');

exports.getCommand = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const command = await DeviceCommand.findOne({
      deviceId,
      delivered: false,
    }).sort({ createdAt: 1 });

    if (!command) {
      return res.json(null);
    }

    command.delivered = true;
    await command.save();

    res.json(command.command);
  } catch (error) {
    next(error);
  }
};

exports.sendCommand = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { command } = req.body;

    const cmd = await DeviceCommand.create({
      deviceId,
      command,
    });

    res.status(201).json(cmd);
  } catch (error) {
    next(error);
  }
};
