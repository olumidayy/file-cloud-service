import pino from 'pino';

const logger = pino({
  name: 'app',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

export default logger;
