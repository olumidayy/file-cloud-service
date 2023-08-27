import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import app from '../../app';
import { FolderMock, FoldersMock, UserMock, UsersMock } from '../../mocks';
import config from '../../../src/config';
import UserService from '../../../src/modules/users/users.service';
import { UserRole } from '@prisma/client';

jest.mock('../../../src/modules/users/users.service', () => ({
  default: {
    getAllUsers: jest.fn(() => UsersMock),
    getUserById: jest.fn((id) => UserMock),
    updateUser: jest.fn(() => UserMock),
    changeUserRole: jest.fn(() => UserMock),
    deleteUser: jest.fn(),
  }
}));


describe('/api/users Endpoints.', () => {
  const token = jwt.sign(UserMock, config.jwtSecretKey);
  describe('GET /api/users', () => {
    it('returns the mocked users data.', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);
      expect(UserService.getAllUsers).toBeCalled();
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Users fetched.');
      expect(response.body.data).toStrictEqual(UsersMock);
    });
  });

  describe('GET /api/users/:id', () => {
    it('returns the mocked data.', async () => {
      const id = 'ID';
      const response = await request(app)
        .get(`/api/users/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(UserService.getUserById).toBeCalledWith(id);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User fetched.');
      expect(response.body.data).toStrictEqual(UserMock);
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('returns the mocked data.', async () => {
      const body = {
        firstname: 'Olamide'
      };
      const id = 'ID';
      const response = await request(app)
        .patch(`/api/users/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);
      expect(UserService.updateUser).toBeCalledWith(id, body);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User updated.');
      expect(response.body.data).toStrictEqual(UserMock);
    });
  });

  describe('PATCH /api/users/:id/change-role', () => {
    it('returns the mocked data.', async () => {
      const body = {
        role: UserRole.ADMIN,
      };
      const id = 'ID';
      const response = await request(app)
        .patch(`/api/users/${id}/change-role`)
        .set('Authorization', `Bearer ${token}`)
        .send(body);
      expect(UserService.changeUserRole).toBeCalledWith(id, body.role);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User updated.');
      expect(response.body.data).toStrictEqual(UserMock);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('returns the mocked data.', async () => {
      const id = 'ID';
      const response = await request(app)
        .delete(`/api/users/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(UserService.deleteUser).toBeCalledWith(id);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User deleted.');
    });
  });
});
