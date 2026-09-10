const Prediction = require('../models/Prediction');

exports.create = async (req, res, next) => {
  try {
    const prediction = await Prediction.create(req.body);
    res.status(201).json(prediction);
  } catch (error) {
    next(error);
  }
};

exports.getByBatch = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const predictions = await Prediction.find({ batchId: req.params.batchId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    res.json(predictions);
  } catch (error) {
    next(error);
  }
};

exports.getLatestByBatch = async (req, res, next) => {
  try {
    const prediction = await Prediction.findOne({ batchId: req.params.batchId })
      .sort({ timestamp: -1 });
    if (!prediction) {
      return res.json(null);
    }
    res.json(prediction);
  } catch (error) {
    next(error);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await Prediction.deleteMany({});
    res.json({ message: 'All predictions cleared' });
  } catch (error) {
    next(error);
  }
};
