require('dotenv').config();

const env = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
  nodeEnv: process.env.NODE_ENV || 'development'
};

const requiredVars = ['DATABASE_URL'];
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`[WARNING] Missing required environment variable: ${varName}`);
  }
});

module.exports = env;
