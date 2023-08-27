import * as express from 'express';
import FolderService from './folders.service';
import APIResponse from '../../common/response';
import { AuthGuard } from '../auth/middlewares';
import { NewFolderValidator, UpdateFolderValidator } from './folders.validators';

export default (app: express.Router) => {
  const foldersRouter = express.Router();
  foldersRouter.use(AuthGuard('*'));
  app.use('/folders', foldersRouter);

  foldersRouter.post(
    '/',
    NewFolderValidator,
    async (req, res, next) => {
      try {
        req.body.userId = req.currentUser.id;
        const folders = await FolderService.createFolder(req.body);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'Folder created.',
          code: 200,
          data: folders,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  foldersRouter.get(
    '/',
    async (req, res, next) => {
      try {
        const folders = await FolderService.getFoldersByUserId(req.currentUser.id);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'Folders fetched.',
          code: 200,
          data: folders,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  foldersRouter.get(
    '/:id',
    async (req, res, next) => {
      try {
        const folder = await FolderService.getFolderById(req.params.id);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'Folder fetched.',
          code: 200,
          data: folder,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  foldersRouter.patch(
    '/:id',
    UpdateFolderValidator,
    async (req, res, next) => {
      try {
        const folder = await FolderService.updateFolder(req.params.id, req.body);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'Folder updated.',
          code: 200,
          data: folder,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  foldersRouter.delete(
    '/:id',
    async (req, res, next) => {
      try {
        await FolderService.deleteFolder(req.params.id);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'Folder deleted.',
          code: 200,
        }));
      } catch (error) {
        next(error);
      }
    },
  );
};
