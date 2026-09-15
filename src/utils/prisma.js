const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const env = require('../config/env');

const pool = new Pool({
  connectionString: env.databaseUrl,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: env.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
});

module.exports = prisma;
