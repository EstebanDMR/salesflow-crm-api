const express = require('express');
const clientController = require('./client.controller');
const protect = require('../../shared/middlewares/protect');
const authorize = require('../../shared/middlewares/authorize');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/', clientController.getAllClients);
router.post('/', clientController.createClient);

module.exports = router;
