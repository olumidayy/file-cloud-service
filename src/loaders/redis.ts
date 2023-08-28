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
  }
}

async function disconnectRedisClient() {
  try {
    if (redisClient.isOpen) {
      await redisClient.disconnect();
    }
    return;
  } catch (error) {
    logger.error('An error occured while attempting to connect redis client.');
    logger.error(error);
  }
}

export {
  connectRedisClient,
  disconnectRedisClient,
  redisClient,
};
