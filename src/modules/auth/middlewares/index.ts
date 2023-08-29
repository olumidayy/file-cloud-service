import { verify } from 'jsonwebtoken';
import { APIError } from '../../../common';
import config from '../../../config';
import logger from '../../../common/logger';
import UserService from '../../users/users.service';
import CacheService from '../../../services/cache.service';

export async function validateToken(token: string): Promise<any> {
  const blacklisted: boolean = await CacheService.IsTokenBlacklisted(token);
  if (blacklisted) {
    logger.error('Session revoked.');
    throw new APIError({ message: 'Unauthorized.', code: 401 });
  }
  return new Promise((resolve, reject) => {
    verify(token, config.jwtSecretKey, (error, decoded) => {
      if (error) return reject(error);
      return resolve(decoded);
    });
  });
}

function getTokenFromHeader(req) {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token')
    || (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}

export function AuthGuard(roles: string | string[]) {
  return async function attachUserData(req, res, next) {
    const token = getTokenFromHeader(req);
    if (token) {
      try {
        const data = await validateToken(token);
        req.currentUser = await UserService.getUserById(data.id);
        logger.info(JSON.stringify(data), req.body);

        if (roles === '*' || roles.includes(data.role)) {
          return next();
        }
        return next(new APIError({ message: 'Unauthorized.', code: 401 }));
      } catch (error) {
        logger.error(error);
        if (error.code) return next(error);
        return next(new APIError({ message: 'Unauthorized.', code: 401 }));
      }
    } else {
      return next(new APIError({ message: 'Unauthorized.', code: 401 }));
    }
  };
}
