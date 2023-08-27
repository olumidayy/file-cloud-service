import * as express from 'express';
import AuthService from './auth.service';
import { APIResponse } from '../../common';
import {
  ChangePasswordValidator, ConfirmOTPValidator, LoginValidator, RegisterValidator, SendOTPValidator,
} from './auth.validators';

const AuthRouter = express.Router();

export default (app: express.Router) => {
  app.use('/auth', AuthRouter);

  AuthRouter.post(
    '/register',
    RegisterValidator,
    async (req, res, next) => {
      try {
        const user = await AuthService.Register(req.body);
        res.status(201).json(new APIResponse({
          success: true,
          message: 'Registration successful.',
          code: 201,
          data: user,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  AuthRouter.post(
    '/login',
    LoginValidator,
    async (req, res, next) => {
      try {
        const result = await AuthService.Login(req.body);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'Authentication successful.',
          code: 200,
          data: result,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  AuthRouter.post(
    '/send-otp',
    SendOTPValidator,
    async (req, res, next) => {
      try {
        await AuthService.SendOTP(req.body.email);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'OTP sent.',
          code: 200,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  AuthRouter.post(
    '/confirm-otp',
    ConfirmOTPValidator,
    async (req, res, next) => {
      try {
        await AuthService.ConfirmOTP(req.body);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'OTP confirmed.',
          code: 200,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  AuthRouter.post(
    '/change-password',
    ChangePasswordValidator,
    async (req, res, next) => {
      try {
        await AuthService.ChangePassword(req.body);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'Password changed.',
          code: 200,
        }));
      } catch (error) {
        next(error);
      }
    },
  );

  AuthRouter.post(
    '/verify-email',
    ConfirmOTPValidator,
    async (req, res, next) => {
      try {
        await AuthService.VerifyEmail(req.body);
        res.status(200).json(new APIResponse({
          success: true,
          message: 'Email verified.',
          code: 200,
        }));
      } catch (error) {
        next(error);
      }
    },
  );
};
