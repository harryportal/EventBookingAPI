import { Response, NextFunction } from 'express';
import { AuthRequest } from '../modules/auth/auth.interface';
import jwt, {Secret} from 'jsonwebtoken';
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

  const secret = process.env.JWT_SECRET as Secret;

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (e) {
    throw new AuthError('Invalid Token Provided');
  }
};
