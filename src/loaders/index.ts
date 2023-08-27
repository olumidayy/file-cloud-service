import { Application } from 'express';
import logger from '../common/logger';
import expressLoader from './express';
import databaseLoader from './prisma';
import { connectRedisClient as redisLoader } from './redis';

export default async ({ expressApp }: { expressApp: Application}) => {
  await expressLoader({ app: expressApp });
  logger.info('🚀 Express loaded.');

  await databaseLoader();
  logger.info('🚀 Database connected.');

  await redisLoader();
  logger.info('🚀 Redis Client connected.');
};
