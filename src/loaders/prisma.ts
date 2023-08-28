import { logger } from '../common';
import prisma from '../../prisma/client';

export default async function connectDatabase() {
  try {
    await prisma.$connect();
  } catch (error) {
    logger.error('Could not connect to database.');
    logger.error(error);
    process.exit(1);
  }
}
