/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import * as express from 'express';
import * as cors from 'cors';
import { isCelebrateError } from 'celebrate';
import expressPinoLogger from 'pino-http';
import routes from '../modules';
import config from '../config';
import { APIError, APIResponse } from '../common';
import logger from '../common/logger';

export default ({ app }: { app: express.Application }) => {
  app.enable('trust proxy');
  app.use(cors());
  app.use(express.json());
  app.use(expressPinoLogger({ logger }));
  app.use(config.api.prefix, routes());

  app.get(config.api.prefix, (req, res, next) => {
    res.status(200).json({
      status: 'success',
      message: 'Hello World!',
      data: null,
    });
  });

  app.get('/', (req, res, next) => {
    res.redirect(config.api.prefix);
  });

  // For handling 404 errors.
  app.use((req, res, next) => {
    const err = new APIError({ message: 'That resource does not exist on this server.' });
    err.code = 404;
    next(err);
  });

  // For handling validation errors.
  app.use((err: APIError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    if (isCelebrateError(err)) {
      let errors: any = err.details.get('body')
        || err.details.get('query')
        || err.details.get('params');
      errors = errors.details.map((x: any) => x.message);
      return res.status(400).json(new APIResponse({
        success: false,
        code: 400,
        message: errors.join(' | '),
      }));
    }
    return next(err);
  });

  // For handling server errors.
  app.use((err: APIError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.code || 500);
    res.json(new APIResponse({
      success: false,
      code: err.code || 500,
      message: err.message,
    }));
  });
};
