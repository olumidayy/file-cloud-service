import * as express from 'express';
import authRoutes from './auth/auth.routes';
import filesRoutes from './files/files.routes';
import foldersRoutes from './folders/folders.routes';
import usersRoutes from './users/users.routes';

export default () => {
  const baseRouter = express.Router();
  authRoutes(baseRouter);
  filesRoutes(baseRouter);
  foldersRoutes(baseRouter);
  usersRoutes(baseRouter);
  return baseRouter;
};
