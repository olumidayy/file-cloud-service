import { UserRole } from '@prisma/client';
import UserRepository from '../../../src/modules/users/users.repository';
import UserService from '../../../src/modules/users/users.service';
import { UserMock, UsersMock } from '../../mocks';

jest.mock('../../../src/modules/users/users.repository', () => ({
  default: {
    getByEmail: jest.fn((email) => {
      if (email == UserMock.email) {
        return UserMock;
      }
      return null;
    }),
    create: jest.fn((data) => data),
    update: jest.fn((id, role) => UserMock),
    getAll: jest.fn(() => UsersMock),
    getById: jest.fn((id) => {
      if (!!id) {
        return UserMock;
      }
      return;
    }),
    delete: jest.fn(),
  }
}));
describe('UserService', () => {
  describe('UserService.getAllUsers', () => {
    it('should call UserRepository.getAll', async () => {
      const users = await UserService.getAllUsers();
      expect(UserRepository.getAll).toBeCalled();
      expect(users).toEqual(UsersMock);
    });
  });

  describe('UserService.getUserById', () => {
    it('should call UserRepository.getById', async () => {
      const id = 'ID';
      const user = await UserService.getUserById(id);
      expect(UserRepository.getById).toBeCalledWith(id);
      expect(user).toEqual(UserMock);
    });
  });

  describe('UserService.getUserById with invalid id', () => {
    it('should throw an error', async () => {
      
      await expect(UserService.getUserById('')).rejects.toThrow('User does not exist.');
    });
  });

  describe('UserService.updateUser', () => {
    it('should call UserRepository.update', async () => {
      const id = 'ID';
      const user = await UserService.updateUser(id, {});
      expect(UserRepository.getById).toBeCalledWith(id);
      expect(UserRepository.update).toBeCalledWith(id, {});
      expect(user).toEqual(UserMock);
    });
  });

  describe('UserService.changeUserRole', () => {
    it('should call UserRepository.update', async () => {
      const id = 'ID';
      const role = UserRole.ADMIN;
      const user = await UserService.changeUserRole(id, role);
      expect(UserRepository.getById).toBeCalledWith(id);
      expect(UserRepository.update).toBeCalledWith(id, { role });
      expect(user).toEqual(UserMock);
    });
  });

  describe('UserService.deleteUser', () => {
    it('should call UserRepository.delete', async () => {
      const id = 'ID';
      await UserService.deleteUser(id);
      expect(UserRepository.getById).toBeCalledWith(id);
      expect(UserRepository.delete).toBeCalledWith(id);
    });
  });

  describe('UserService.deleteUser when user does not exist.', () => {
    it('should throw an Error', async () => {
      const id = 'ID';
      await expect(UserService.deleteUser('')).rejects.toThrow('User does not exist.');
    });
  });
});
