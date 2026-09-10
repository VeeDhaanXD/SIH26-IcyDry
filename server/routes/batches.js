const express = require('express');
const router = express.Router();
const { create, getAll, getById, getActive, update, complete, deleteAll } = require('../controllers/batchController');

router.post('/', create);
router.get('/', getAll);
router.get('/active', getActive);
router.get('/:id', getById);
router.put('/:id', update);
router.post('/:id/complete', complete);
router.delete('/', deleteAll);

module.exports = router;
