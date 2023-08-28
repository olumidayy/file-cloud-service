import { createClient } from 'redis';
import config from '../config';
import { logger } from '../common';

const redisClient = createClient({
  url: config.redisUrl,
});

async function connectRedisClient() {
  try {
    await redisClient.connect();
    return;
  } catch (error) {
    logger.error('An error occured while attempting to connect redis client.');
    logger.error(error);
    process.exit(1);
  }
}

export {
  connectRedisClient,
  redisClient,
};
