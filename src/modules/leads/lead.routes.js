const express = require('express');
const leadController = require('./lead.controller');
const {
  createLeadSchema,
  updateLeadSchema,
  updateLeadStatusSchema,
  queryLeadSchema,
} = require('./lead.schema');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const authorize = require('../../middlewares/authorize');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'manager', 'sales'));

router.get('/', validate({ query: queryLeadSchema }), leadController.getAllLeads);
router.get('/:id', leadController.getLeadById);
router.post('/', validate({ body: createLeadSchema }), leadController.createLead);
router.put('/:id', validate({ body: updateLeadSchema }), leadController.updateLead);
router.patch('/:id/status', validate({ body: updateLeadStatusSchema }), leadController.updateLeadStatus);
router.delete('/:id', leadController.deleteLead);

module.exports = router;
