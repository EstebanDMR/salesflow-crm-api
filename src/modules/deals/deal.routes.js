const express = require('express');
const dealController = require('./deal.controller');
const {
  createDealSchema,
  updateDealSchema,
  queryDealSchema,
} = require('./deal.schema');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const authorize = require('../../middlewares/authorize');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'manager', 'sales'));

// Statistics endpoint (must precede /:id)
router.get('/stats', dealController.getDealStats);

// Standard CRUD endpoints
router.get('/', validate({ query: queryDealSchema }), dealController.getAllDeals);
router.get('/:id', dealController.getDealById);
router.post('/', validate({ body: createDealSchema }), dealController.createDeal);
router.put('/:id', validate({ body: updateDealSchema }), dealController.updateDeal);
router.delete('/:id', dealController.deleteDeal);

module.exports = router;
