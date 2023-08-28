import { User, UserRole } from '@prisma/client';
import * as express from 'express';
import UserService from './users.service';
import APIResponse from '../../common/response';
import { AuthGuard } from '../auth/middlewares';
import { ChangeRoleValidator, UpdateProfileValidator } from './users.validators';
import { paginateData } from '../../common/helpers';

const usersRouter = express.Router();

export default (app: express.Router) => {
  app.use('/users', usersRouter);
  usersRouter.use(AuthGuard('*'));

  usersRouter.get(
    '/',
    async (req, res, next) => {
      try {
        const users: User[] = await UserService.getAllUsers();
        res.status(200).json(new APIResponse({
          success: true,
          message: 'Users fetched.',
          code: 200,
          data: paginateData(users, req.query.page),
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  usersRouter.get(
    '/:id',
    async (req, res, next) => {
      try {
        const user: User = await UserService.getUserById(req.params.id);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'User fetched.',
          code: 200,
          data: user,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  usersRouter.patch(
    '/:id',
    UpdateProfileValidator,
    async (req, res, next) => {
      try {
        const user: User = await UserService.updateUser(req.params.id, req.body);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'User updated.',
          code: 200,
          data: user,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  usersRouter.patch(
    '/:id/change-role',
    AuthGuard([UserRole.ADMIN]),
    ChangeRoleValidator,
    async (req, res, next) => {
      try {
        const user: User = await UserService.changeUserRole(req.params.id, req.body.role);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'User updated.',
          code: 200,
          data: user,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  usersRouter.delete(
    '/:id',
    async (req, res, next) => {
      try {
        await UserService.deleteUser(req.params.id);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'User deleted.',
          code: 200,
        }));
      } catch (error) {
        next(error);
      }
    },
  );
};
