const express = require('express');
const leadController = require('./lead.controller');
const protect = require('../../shared/middlewares/protect');
const authorize = require('../../shared/middlewares/authorize');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'manager', 'sales'));

router.put('/:id', leadController.updateLead);

module.exports = router;
