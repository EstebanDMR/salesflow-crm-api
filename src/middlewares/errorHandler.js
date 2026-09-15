const env = require('../config/env');
const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // Log error with request context
  logger.error(
    {
      err: {
        message: err.message,
        stack: err.stack,
        code: err.code,
      },
      req: {
        method: req.method,
        url: req.url,
        ip: req.ip,
      },
    },
    err.message
  );

  // Handle malformed JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload in request body';
  }

  // Handle Prisma Known Request Errors
  if (err.code) {
    switch (err.code) {
      case 'P2002': {
        statusCode = 409;
        const target = err.meta?.target ? err.meta.target.join(', ') : 'field';
        message = `Unique constraint violation: A record with this ${target} already exists.`;
        break;
      }
      case 'P2025': {
        statusCode = 404;
        message = err.meta?.cause || 'Record not found or already deleted.';
        break;
      }
      case 'P2003': {
        statusCode = 400;
        message = 'Foreign key constraint violation: Related record does not exist.';
        break;
      }
      default:
        break;
    }
  }

  // Handle JWT specific errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  const response = {
    success: false,
    message,
    data: null,
  };

  if (details) {
    response.errors = details;
  }

  if (env.nodeEnv === 'development') {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
