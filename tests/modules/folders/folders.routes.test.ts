import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import app from '../../app';
import { FolderMock, FoldersMock, UserMock } from '../../mocks';
import config from '../../../src/config';
import FolderService from '../../../src/modules/folders/folders.service';

jest.mock('../../../src/modules/folders/folders.service', () => ({
  default: {
    createFolder: jest.fn((data) => FolderMock),
    getAllFolders: jest.fn(() => FoldersMock),
    getFolderById: jest.fn((id) => id ? FolderMock : null),
    getFoldersByUserId: jest.fn(() => FoldersMock),
    updateFolder: jest.fn(() => FolderMock),
    deleteFolder: jest.fn(),
  }
}));

jest.mock('../../../src/modules/users/users.service', () => ({
  default: {
    getUserById: jest.fn((id) => UserMock),
  }
}));


describe('/api/folders Endpoints.', () => {
  const token = jwt.sign(UserMock, config.jwtSecretKey);
  describe('POST /api/folders', () => {
    it('returns the mocked data.', async () => {
      const body = {
        name: 'New Folder name',
        userId: UserMock.id,
      };
      const response = await request(app)
        .post('/api/folders')
        .set('Authorization', `Bearer ${token}`)
        .send(body);
      expect(FolderService.createFolder).toBeCalledWith(body);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Folder created.');
      expect(response.body.data).toStrictEqual(FolderMock);
    });
  });

  describe('GET /api/folders', () => {
    it('returns the mocked data.', async () => {
      const response = await request(app)
        .get('/api/folders')
        .set('Authorization', `Bearer ${token}`);
      expect(FolderService.getFoldersByUserId).toBeCalledWith(UserMock.id);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Folders fetched.');
      expect(response.body.data).toStrictEqual(FoldersMock);
    });
  });

  describe('GET /api/folders/:id', () => {
    it('returns the mocked data.', async () => {
      const id = 'ID';
      const response = await request(app)
        .get(`/api/folders/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(FolderService.getFolderById).toBeCalledWith(id);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Folder fetched.');
      expect(response.body.data).toStrictEqual(FolderMock);
    });
  });

  describe('PATCH /api/folders/:id', () => {
    it('returns the mocked data.', async () => {
      const body = {
        name: 'New Folder name'
      };
      const id = 'ID';
      const response = await request(app)
        .patch(`/api/folders/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);
      expect(FolderService.updateFolder).toBeCalledWith(id, body);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Folder updated.');
      expect(response.body.data).toStrictEqual(FolderMock);
    });
  });


  describe('DELETE /api/folders/:id', () => {
    it('returns the mocked data.', async () => {
      const id = 'ID';
      const response = await request(app)
        .delete(`/api/folders/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(FolderService.deleteFolder).toBeCalledWith(id);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Folder deleted.');
    });
  });
});
