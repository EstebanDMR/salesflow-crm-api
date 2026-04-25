const env = require('../config/env');
const { logger } = require('../lib/logger');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error({ err, req: { method: req.method, url: req.url } }, err.message);

  if (env.nodeEnv === 'development') {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err,
      stack: err.stack,
      data: null
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
        data: null
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Something went very wrong!',
        data: null
      });
    }
  }
};

module.exports = errorHandler;
