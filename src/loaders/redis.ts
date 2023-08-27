import { createClient } from 'redis';
import { logger } from '../common';
import config from '../config';

const redisClient = createClient({
  url: `redis://:@${config.redisHost}:6379`,
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
