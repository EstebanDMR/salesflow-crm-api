const env = require('./config/env');
const { logger } = require('./utils/logger');
const prisma = require('./utils/prisma');
const app = require('./app');

const server = app.listen(env.port, () => {
  logger.info(`==================================================`);
  logger.info(`🚀 SalesFlow CRM API running in ${env.nodeEnv.toUpperCase()} mode`);
  logger.info(`📡 Server address: http://localhost:${env.port}`);
  logger.info(`📖 Swagger Docs:  http://localhost:${env.port}/api/docs`);
  logger.info(`❤️  Health check:  http://localhost:${env.port}/api/health`);
  logger.info(`==================================================`);
});

// Graceful shutdown handling
const shutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await prisma.$disconnect();
      logger.info('Prisma database connection closed.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during database disconnection:', err);
      process.exit(1);
    }
  });

  // Force close after 10s if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection at Promise:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown:', error);
  process.exit(1);
});
