require('dotenv').config();

const env = {
  port: parseInt(process.env.PORT, 10) || 5000,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

const requiredVars = ['DATABASE_URL'];
requiredVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.warn(`[WARNING] Missing recommended environment variable: ${varName}`);
  }
});

module.exports = env;
