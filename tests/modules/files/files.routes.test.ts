import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import app from '../../app';
import { FileHistoriesMock, FileHistoryMock, FileMock, FilesMock, FlagMock, FolderMock, UserMock } from '../../mocks';
import config from '../../../src/config';
import FileService from '../../../src/modules/files/files.service';
import UserService from '../../../src/modules/users/users.service';
import FolderService from '../../../src/modules/folders/folders.service';
import S3Service from '../../../src/services/s3.service';
import { FileAction } from '@prisma/client';
import CacheService from '../../../src/services/cache.service';
import FileRepository from '../../../src/modules/files/files.repository';

jest.mock('../../../src/modules/files/files.service', () => ({
  default: {
    createFile: jest.fn((data) => FileMock),
    getAllFiles: jest.fn(() => FilesMock),
    getFileById: jest.fn((id) => id ? FileMock : null),
    getFilesByUserId: jest.fn(() => FilesMock),
    updateFile: jest.fn(() => FileMock),
    deleteFile: jest.fn(() => FileMock.key),
    flagFile: jest.fn(() => FlagMock),
    unflagFile: jest.fn(() => FlagMock),
    addFileHistory: jest.fn(() => FileHistoryMock),
    getFileHistory: jest.fn(() => FileHistoriesMock),
  }
}));

jest.mock('../../../src/modules/users/users.service', () => ({
  default: {
    getUserById: jest.fn((id) => UserMock),
  }
}));

jest.mock('../../../src/modules/folders/folders.service', () => ({
  default: {
    getFolderById: jest.fn((id) => FolderMock),
  }
}));

jest.mock('../../../src/modules/files/files.repository', () => ({
  default: {
    getOne: jest.fn(),
  }
}));

jest.mock('../../../src/services/cache.service', () => ({
  default: {
    DeleteItem: jest.fn(),
  }
}));

jest.mock('../../../src/services/s3.service', () => ({
  default: {
    UploadFileToS3: jest.fn(() => ({ Key: 'key' })),
    UpdateFile: jest.fn(),
    DownloadFileFromS3: jest.fn(() => ({ fileStream: {
      pipe: jest.fn()
    }})),
    DeleteFileFromS3: jest.fn(),
  }
}));

describe('/api/files Endpoints.', () => {
  const token = jwt.sign(UserMock, config.jwtSecretKey);
  describe('POST /api/files/upload', () => {
    it('returns the mocked data.', async () => {
      const body = {
        name: 'New File name',
        folderId: 'folderId'
      };
      const response = await request(app)
        .post('/api/files/upload')
        .set('Authorization', `Bearer ${token}`)
        .field('name', body.name)
        .field('folderId', body.folderId)
        .attach('file', `${__dirname}/test.png`);
      expect(FolderService.getFolderById).toBeCalledWith(body.folderId);
      expect(FileRepository.getOne).toBeCalled();
      expect(S3Service.UploadFileToS3).toBeCalled();
      expect(FileService.createFile).toBeCalled();
      expect(CacheService.DeleteItem).toBeCalled();
      expect(FileService.addFileHistory).toBeCalledWith(FileMock.id, FileAction.UPLOAD);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File uploaded.');
      expect(response.body.data).toStrictEqual(FileMock);
    });
  });

  describe('GET /api/files', () => {
    it('returns the mocked data.', async () => {
      const response = await request(app)
        .get('/api/files/')
        .set('Authorization', `Bearer ${token}`);
      expect(UserService.getUserById).toBeCalledWith(UserMock.id);
      expect(FileService.getFilesByUserId).toBeCalledWith(UserMock.id);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Files fetched.');
      expect(response.body.data).toStrictEqual(FilesMock);
    });
  });

  describe('GET /api/files/all', () => {
    it('returns the mocked data.', async () => {
      const response = await request(app)
        .get('/api/files/all')
        .set('Authorization', `Bearer ${token}`);
      expect(FileService.getAllFiles).toBeCalled();
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Files fetched.');
      expect(response.body.data).toStrictEqual(FilesMock);
    });
  });

  describe('GET /api/files/:id', () => {
    it('returns the mocked data.', async () => {
      const id = 'ID';
      const response = await request(app)
        .get(`/api/files/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(FileService.getFileById).toBeCalledWith(FileMock.id);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File fetched.');
      expect(response.body.data).toStrictEqual(FileMock);
    });
  });

  describe('GET /api/files/:id/history', () => {
    it('returns the mocked data.', async () => {
      const id = 'ID';
      const response = await request(app)
        .get(`/api/files/${id}/history`)
        .set('Authorization', `Bearer ${token}`);
      expect(FileService.getFileHistory).toBeCalledWith(FileMock.id);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File history fetched.');
      expect(response.body.data).toStrictEqual(FileHistoriesMock);
    });
  });

  describe('POST /api/files/:id/flag', () => {
    it('returns the mocked data.', async () => {
      const id = 'ID';
      const response = await request(app)
        .post(`/api/files/${id}/flag`)
        .set('Authorization', `Bearer ${token}`);
      expect(FileService.getFileById).toBeCalledWith(FileMock.id);
      expect(FileService.flagFile).toBeCalledWith(id, UserMock.id);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File marked as unsafe.');
      expect(response.body.data).toStrictEqual(FlagMock);
    });
  });

  describe('POST /api/files/:id/unflag', () => {
    it('returns the mocked data.', async () => {
      const id = 'ID';
      const response = await request(app)
        .post(`/api/files/${id}/unflag`)
        .set('Authorization', `Bearer ${token}`);
      expect(FileService.unflagFile).toBeCalledWith(id, UserMock.id);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File marked as safe.');
    });
  });

  describe('PATCH /api/files/:id', () => {
    it('returns the mocked data.', async () => {
      const body = {
        name: 'New File name',
        folderId: 'folderId'
      };
      const id = 'ID';
      const response = await request(app)
        .patch(`/api/files/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .field('name', body.name)
        .attach('file', `${__dirname}/test.png`);
      expect(FileService.getFileById).toBeCalledWith(id);
      expect(FileService.updateFile).toBeCalledWith(id, { name: body.name });
      expect(S3Service.UpdateFile).toBeCalled();
      expect(FileService.addFileHistory).toBeCalledWith(FileMock.id, FileAction.UPDATE);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File updated.');
      expect(response.body.data).toStrictEqual(FileMock);
    });
  });



  describe('DELETE /api/files/:id', () => {
    it('returns the mocked data.', async () => {
      const id = 'ID';
      const response = await request(app)
        .delete(`/api/files/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(FileService.addFileHistory).toBeCalledWith(FileMock.id, FileAction.DELETE);
      expect(FileService.deleteFile).toBeCalledWith(FileMock.id);
      expect(S3Service.DeleteFileFromS3).toBeCalledWith(FileMock.key);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('File deleted.');
    });
  });
});
