import { Response, NextFunction } from 'express';
import { AuthRequest } from '../modules/auth/auth.interface';
import { verifyJWT } from '../utils/jwtAuth/jwt';
import { AuthError } from './error';

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    throw new AuthError('No Authentication Provided');
  }

  const [, token] = bearer.split(' '); // destructuring
  if (!token) {
    throw new AuthError('Bearer has no token');
  }

  const payload = verifyJWT(token);
  req.user = payload;
  next();

}