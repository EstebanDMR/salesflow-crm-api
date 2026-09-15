const express = require('express');
const sendResponse = require('../utils/sendResponse');

const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const clientRoutes = require('../modules/clients/client.routes');
const leadRoutes = require('../modules/leads/lead.routes');
const dealRoutes = require('../modules/deals/deal.routes');
const taskRoutes = require('../modules/tasks/task.routes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  return sendResponse(res, 200, 'SalesFlow CRM API is healthy and operational', {
    status: 'up',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

// Module routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/leads', leadRoutes);
router.use('/deals', dealRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;
