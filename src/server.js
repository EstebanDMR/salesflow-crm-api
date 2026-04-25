const env = require('./shared/config/env');
const { logger } = require('./shared/lib/logger');
const app = require('./app');

app.listen(env.port, () => {
  logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
});
