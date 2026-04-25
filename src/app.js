const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { httpLogger } = require('./shared/lib/logger');
const globalLimiter = require('./shared/middlewares/rateLimiter');
const notFound = require('./shared/middlewares/notFound');
const errorHandler = require('./shared/middlewares/errorHandler');
const sendResponse = require('./shared/utils/sendResponse');

const app = express();

// HTTP request logger
app.use(httpLogger);

// Security Headers
app.use(helmet());

// CORS
app.use(cors());

// Body parser
app.use(express.json());

// Global Rate Limiter for /api routes
app.use('/api', globalLimiter);

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const clientRoutes = require('./modules/clients/client.routes');
const taskRoutes = require('./modules/tasks/task.routes');
const leadRoutes = require('./modules/leads/lead.routes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leads', leadRoutes);

app.get('/api/health', (req, res) => {
    sendResponse(res, 200, 'SalesFlow API running');
});

// Handle 404 - Not Found
app.all('*', notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;