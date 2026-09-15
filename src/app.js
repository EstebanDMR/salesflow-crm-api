const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const env = require('./config/env');
const swaggerSpec = require('./config/swagger');
const { httpLogger } = require('./utils/logger');
const { globalLimiter } = require('./middlewares/rateLimiter');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const apiRoutes = require('./routes/index');

const app = express();

// HTTP request logging with Pino
app.use(httpLogger);

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI inline assets
  })
);

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: env.corsOrigin === '*' ? true : env.corsOrigin,
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Global Rate Limiting
app.use('/api', globalLimiter);

// Swagger Interactive API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'SalesFlow CRM API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
}));
app.get('/api/docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Routes
app.use('/api', apiRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'SalesFlow CRM API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health',
  });
});

// 404 Handler
app.use(notFound);

// Global Centralized Error Handler
app.use(errorHandler);

module.exports = app;