import { APIError, logger } from '../common';
import { redisClient } from '../loaders/redis';

export default class CacheService {
  static BLACKLIST = 'revoked_tokens';

  static async SetItem(key: string, data: any) {
    try {
      await redisClient.set(key, JSON.stringify(data), {
        EX: 60 * 60 * 12,
      });
    } catch (error) {
      logger.error(error);
      throw new APIError({ message: 'Error occured while setting item with redis.' });
    }
  }

  static async GetItem(key: string) {
    try {
      const data = await redisClient.get(key);
      if (!data) {
        return data;
      }
      return JSON.parse(data);
    } catch (error) {
      logger.error(error);
      throw new APIError({ message: 'Error occured while getting item from redis.' });
    }
  }

  static async DeleteItem(key: string) {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error(error);
      throw new APIError({ message: 'Error occured while deleting item from redis.' });
    }
  }

  static async BlacklistToken(token: string) {
    const blacklist = await redisClient.get(this.BLACKLIST);
    const tokenList: string[] = blacklist ? JSON.parse(blacklist) : [];
    tokenList.push(token);
    await redisClient.set(this.BLACKLIST, JSON.stringify(tokenList), {
      EX: 60 * 60 * 12,
    });
  }

  static async IsTokenBlacklisted(token: string) {
    const blacklist = await redisClient.get(this.BLACKLIST);
    const tokenList: string[] = blacklist ? JSON.parse(blacklist) : [];
    return tokenList.includes(token);
  }
}
