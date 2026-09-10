const Batch = require('../models/Batch');

exports.create = async (req, res, next) => {
  try {
    const count = await Batch.countDocuments();
    const batchId = `BATCH-${String(count + 1).padStart(3, '0')}`;
    const batch = await Batch.create({ ...req.body, batchId });
    res.status(201).json(batch);
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = status ? { status } : {};
    const batches = await Batch.find(filter).sort({ createdAt: -1 }).limit(parseInt(limit));
    res.json(batches);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const batch = await Batch.findOne({ batchId: req.params.id });
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.json(batch);
  } catch (error) {
    next(error);
  }
};

exports.getActive = async (req, res, next) => {
  try {
    const batch = await Batch.findOne({ status: 'DRYING' }).sort({ createdAt: -1 });
    res.json(batch || null);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const batch = await Batch.findOneAndUpdate(
      { batchId: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.json(batch);
  } catch (error) {
    next(error);
  }
};

exports.complete = async (req, res, next) => {
  try {
    const { finalMoisture, qualityScore } = req.body;
    const batch = await Batch.findOne({ batchId: req.params.id });
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    batch.status = 'COMPLETED';
    batch.endTime = new Date();
    batch.finalMoisture = finalMoisture;
    batch.dryingTime = Math.round((batch.endTime - batch.startTime) / 60000);
    batch.qualityScore = qualityScore;
    await batch.save();
    res.json(batch);
  } catch (error) {
    next(error);
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    await Batch.deleteMany({});
    res.json({ message: 'All batches cleared' });
  } catch (error) {
    next(error);
  }
};
