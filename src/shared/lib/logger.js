const pino = require('pino');
const pinoHttp = require('pino-http');
const env = require('../config/env');

const isDev = env.nodeEnv === 'development';

const logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: isDev ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  } : undefined,
});

const httpLogger = pinoHttp({
  logger,
  autoLogging: true,
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url
    }),
    res: (res) => ({
      statusCode: res.statusCode
    })
  }
});

module.exports = { logger, httpLogger };
