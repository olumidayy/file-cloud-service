import * as request from 'supertest';
import app from '../../app';
import { FolderMock, FoldersMock, UserMock } from '../../mocks';
import AuthService from '../../../src/modules/auth/auth.service';

jest.mock('../../../src/modules/auth/auth.service', () => ({
  default: {
    Register: jest.fn((data) => UserMock),
    Login: jest.fn(() => UserMock),
    SendOTP: jest.fn(),
  }
}));


describe('/api/auth Endpoints.', () => {
  describe('POST /api/auth/register', () => {
    it('returns new user data.', async () => {
      const body = {
        firstname: UserMock.firstname,
        lastname: UserMock.lastname,
        email: UserMock.email,
        password: UserMock.password,
      };
      const response = await request(app)
        .post('/api/auth/register')
        .send(body);
      expect(AuthService.Register).toBeCalledWith(body);
      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration successful.');
      expect(response.body.data).toStrictEqual(UserMock);
    });
  });

  describe('POST /api/auth/login', () => {
    const body = {
      email: UserMock.email,
      password: UserMock.password,
    };
    it('signs the user in.', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(body);
      expect(AuthService.Login).toBeCalledWith(body);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Authentication successful.');
      expect(response.body.data).toStrictEqual(UserMock);
    });
  });

  describe('POST /api/auth/send-otp', () => {
    it('returns the mocked data.', async () => {
      const id = 'ID';
      const response = await request(app)
        .post(`/api/auth/send-otp`)
        .send({ email: UserMock.email });
      expect(AuthService.SendOTP).toBeCalledWith(UserMock.email);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('OTP sent.');
    });
  });
});
