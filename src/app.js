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

// Routes
app.get('/api/health', (req, res) => {
    sendResponse(res, 200, 'SalesFlow API running');
});

// Handle 404 - Not Found
app.all('*', notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;