import * as dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config();

export default {

  port: process.env.PORT || 8000,

  databaseURL: process.env.DB_URL as string,

  saltRounds: process.env.SAlT_ROUNDS || 10,

  jwtSecretKey: process.env.JWT_SECRET_KEY as string,

  AWS: {
    secretKey: process.env.AWS_SECRET_KEY as string,
    accessKey: process.env.AWS_ACCESS_KEY as string,
    region: process.env.AWS_REGION as string,
    bucketName: process.env.AWS_BUCKET_NAME as string,
  },

  maxFlagCount: Number(process.env.MAX_FLAG_COUNT) || 5,

  redisUrl: process.env.REDIS_URL || 'redis://:@localhost:6379',

  api: {
    prefix: '/api',
  },

};
