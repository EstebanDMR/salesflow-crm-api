const express = require('express');
const taskController = require('./task.controller');
const protect = require('../../shared/middlewares/protect');
const authorize = require('../../shared/middlewares/authorize');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'manager', 'sales'));

router.get('/my', taskController.getMyTasks);

module.exports = router;
