import app from './app';
import logger from './common/logger';
import config from './config';

app.listen(config.port, () => logger.info(`
    🚀 Server ready at: http://localhost:${config.port}${config.api.prefix}
`));
