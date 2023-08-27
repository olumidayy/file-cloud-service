import { Router, Request } from 'express';
import * as multer from 'multer';
import * as mime from 'mime';
import { File, FileAction, UserRole } from '@prisma/client';
import FileService from './files.service';
import { APIResponse, APIError } from '../../common';
import { AuthGuard } from '../auth/middlewares';
import FolderService from '../folders/folders.service';
import S3Service from '../../services/s3.service';
import { UpdateFileValidator, UploadFileValidator } from './files.validators';
import FileRepository from './files.repository';
import CacheService from '../../services/cache.service';

const upload = multer({
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB
  },
});
export default (app: Router) => {
  const filesRouter = Router();
  filesRouter.use(AuthGuard('*'));
  app.use('/files', filesRouter);

  filesRouter.post(
    '/upload',
    upload.single('file'),
    UploadFileValidator,
    async (req: Request, res, next) => {
      if (!req.file) {
        throw new APIError({ message: 'File is missing.', code: 400 });
      }
      try {
        const exists = await FileRepository.getOne({
          name: req.body.name,
          userId: req.currentUser.id,
        });
        if (exists) {
          throw new APIError({ message: 'You already own a file with that name.', code: 400 });
        }
        if (req.body.folderId) {
          await FolderService.getFolderById(req.body.folderId);
          CacheService.DeleteItem(req.body.folderId);
        }
        const s3File: any = await S3Service.UploadFileToS3(req.file, Boolean(req.body.compress));
        req.body.key = s3File.Key;
        req.body.userId = req.currentUser.id;
        delete req.body.compress;
        const file = await FileService.createFile(req.body);
        await FileService.addFileHistory(file.id, FileAction.UPLOAD);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'File uploaded.',
          code: 200,
          data: file,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  filesRouter.get(
    '/',
    async (req, res, next) => {
      try {
        const files = await FileService.getFilesByUserId(req.currentUser.id);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'Files fetched.',
          code: 200,
          data: files,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  filesRouter.get(
    '/all',
    AuthGuard([UserRole.ADMIN]),
    async (req, res, next) => {
      try {
        const files = await FileService.getAllFiles();
        res.status(200).json(new APIResponse({
          success: true,
          message: 'Files fetched.',
          code: 200,
          data: files,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  filesRouter.get(
    '/:id',
    async (req, res, next) => {
      try {
        const file = await FileService.getFileById(req.params.id);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'File fetched.',
          code: 200,
          data: file,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  filesRouter.get(
    '/:id/history',
    async (req, res, next) => {
      try {
        const file = await FileService.getFileHistory(req.params.id);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'File history fetched.',
          code: 200,
          data: file,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  filesRouter.get(
    '/:id/download',
    async (req, res, next) => {
      try {
        const file = await FileService.getFileById(req.params.id);
        const { fileStream } = await S3Service.DownloadFileFromS3(file.key);
        await FileService.addFileHistory(req.params.id, FileAction.DOWNLOAD);
        const fileExtension = file.key.split('.').pop();
        res.attachment(`${file.name}.${fileExtension}`);
        fileStream.pipe(res);
      } catch (error) {
        next(error);
      }
    },
  );

  filesRouter.get(
    '/:id/stream',
    async (req, res, next) => {
      try {
        const file = await FileService.getFileById(req.params.id);
        const { range = '0' } = req.headers;
        const fileExtension = file.key.split('.').pop();
        if (!fileExtension) {
          throw new APIError({ message: 'This file cannot be streamed.', code: 400 });
        }
        const mimeType = mime.getType(fileExtension);
        if (!mimeType) {
          throw new APIError({ message: 'This file cannot be streamed.', code: 400 });
        }
        const fileType = mimeType.split('/').at(0);
        if (!(fileType === 'video' || fileType === 'audio')) {
          throw new APIError({ message: 'This file cannot be streamed.', code: 400 });
        }
        const { fileStream, fileSize = 1 } = await S3Service.DownloadFileFromS3(file.key);
        await FileService.addFileHistory(req.params.id, FileAction.STREAM);
        const chunkSize = 1024 * 1024;
        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start + chunkSize, fileSize - 1);
        res.header({
          'Content-Type': mimeType,
          'Content-Length': fileSize,
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
        });
        fileStream.pipe(res);
      } catch (error) {
        next(error);
      }
    },
  );

  filesRouter.post(
    '/:id/flag',
    AuthGuard([UserRole.ADMIN]),
    async (req, res, next) => {
      try {
        const file: File = await FileService.getFileById(req.params.id);
        const photoAndVideoTypes = ['jpeg', 'jpg', 'png', 'gif', 'mp4'];
        const fileType = file.key.split('.').pop();
        if (!fileType || !photoAndVideoTypes.includes(fileType)) {
          throw new APIError({ message: 'Only photos and videos can be flagged.' });
        }
        const flag = await FileService.flagFile(req.params.id, req.currentUser.id);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'File marked as unsafe.',
          code: 200,
          data: flag,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  filesRouter.post(
    '/:id/unflag',
    async (req, res, next) => {
      try {
        await FileService.unflagFile(req.params.id, req.currentUser.id);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'File marked as safe.',
          code: 200,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  filesRouter.patch(
    '/:id',
    UpdateFileValidator,
    upload.single('file'),
    async (req, res, next) => {
      try {
        let file = await FileService.getFileById(req.params.id);
        if (req.body.name) {
          file = await FileService.updateFile(req.params.id, { name: req.body.name });
        }
        if (req.file) {
          await S3Service.UpdateFile(req.file, file.key, req.body.compress);
          await FileService.addFileHistory(req.params.id, FileAction.UPDATE);
        }
        res.status(200).json(new APIResponse({
          success: true,
          message: 'File updated.',
          code: 200,
          data: file,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  filesRouter.delete(
    '/:id',
    async (req, res, next) => {
      try {
        const key = await FileService.deleteFile(req.params.id);
        await FileService.addFileHistory(req.params.id, FileAction.DELETE);
        await S3Service.DeleteFileFromS3(key);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'File deleted.',
          code: 200,
        }));
      } catch (error) {
        next(error);
      }
    },
  );
};
