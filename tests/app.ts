import * as express from 'express';
import expressLoader from '../src/loaders/express';

const app = express();
expressLoader({ app });

export default app;
