import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { validateToken } from '../../../src/modules/auth/middlewares';
import generateOTP from '../../../src/common/helpers';
import AuthService from '../../../src/modules/auth/auth.service';
import UserRepository from '../../../src/modules/users/users.repository';
import { UserMock } from '../../mocks';

jest.mock('bcrypt', () => ({
  compare: jest.fn(() => true),
  hash: jest.fn((password, _) => password),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => token),
  verify: jest.fn(() => ({ otp: 'otp' }))
}));

jest.mock('../../../src/common/helpers', () => ({
  default: jest.fn(),
}));

jest.mock('../../../src/modules/users/users.repository', () => ({
  default: {
    getByEmail: jest.fn((email) => {
      if (email == UserMock.email) {
        return UserMock;
      }
      return null;
    }),
    create: jest.fn((data) => data),
    update: jest.fn(() => UserMock),
  }
}));

jest.mock('../../../src/modules/auth/middlewares', () => ({
  validateToken: jest.fn(() => ({ otp: 'otp' })), 
}));

const token = 'token';

describe('AuthService', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  
  describe('AuthService.Register with an email that does not exist.', () => {
    it('should call UserRepository.getByEmail and UserRepository.create', async () => {
      const data = {
        ...UserMock,
        email: ''
      };
      const user = await AuthService.Register(data);
      expect(UserRepository.getByEmail).toBeCalledWith(data.email);
      expect(bcrypt.hash).toBeCalled();
      expect(UserRepository.create).toBeCalledTimes(1);
      expect(user).toBeDefined();
      expect(user.firstname).toEqual(data.firstname);
      expect(user.lastname).toEqual(data.lastname);
      expect(user.email).toEqual(data.email);
    });
  });

  describe('AuthService.Register with an email that exists.', () => {
    it('should throw an error', async () => {
      await expect(AuthService.Register(UserMock)).rejects.toThrow('Email is already in use.');
    });
  });

  describe('AuthService.Login with a user that exists.', () => {
    it('should return the mocked data and call UserRepository.getByEmail', async () => {
      const loginData = {
        email: UserMock.email,
        password: UserMock.password,
      };
      const data = await AuthService.Login(loginData);
      expect(UserRepository.getByEmail).toBeCalledWith(loginData.email);
      expect(bcrypt.compare).toBeCalled();
      expect(data.user.email).toEqual(loginData.email);
      expect(data.token).toEqual(token);
    });
  });

  describe('AuthService.Login with a user that does not exist.', () => {
    it('should return the mocked data and call UserRepository.getByEmail', async () => {
      const loginData = {
        email: '',
        password: UserMock.password,
      };
      await expect(AuthService.Login(loginData)).rejects.toThrow('User does not exist.');
    });
  });

  describe('AuthService.SendOTP.', () => {
    it('should call UserRepository and other functions', async () => {
      const data = await AuthService.SendOTP(UserMock.email);
      expect(UserRepository.getByEmail).toBeCalledWith(UserMock.email);
      expect(generateOTP).toBeCalled();
      expect(jwt.sign).toBeCalled();
      expect(UserRepository.update).toBeCalled();
    });
  });

  describe('AuthService.ConfirmOTP.', () => {
    it('should call UserRepository and other functions', async () => {
      const data = await AuthService.ConfirmOTP({ email: UserMock.email, otp: 'otp' });
      expect(UserRepository.getByEmail).toBeCalledWith(UserMock.email);
      expect(validateToken).toBeCalled();
    });
  });

  describe('AuthService.ChangePassword.', () => {
    it('should call UserRepository and other functions.', async () => {
      const data = {
        email: UserMock.email,
        password: UserMock.password,
        confirmPassword: UserMock.password,
        otp: 'otp',
      };
      await AuthService.ChangePassword(data);
      expect(UserRepository.getByEmail).toBeCalledWith(UserMock.email);
      expect(validateToken).toBeCalled();
      expect(bcrypt.hash).toBeCalled();
      expect(UserRepository.update).toBeCalled();
    });
  });

  describe('AuthService.VerifyEmail.', () => {
    it('should call UserRepository and other functions.', async () => {
      await AuthService.VerifyEmail({ email: UserMock.email, otp: 'otp' });
      expect(UserRepository.getByEmail).toBeCalledWith(UserMock.email);
      expect(validateToken).toBeCalled();
      expect(UserRepository.update).toBeCalled();
    });
  });
});
