import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthError, InternalServerError  } from '../../common/error';
import { userPayload } from '../../modules/auth/auth.interface';

const hashPassword = (password: string) => {
  return bcrypt.hash(password, 5);
};

const comparePassword = (password: string, hash) => {
  return bcrypt.compare(password, hash);
};

const createJWT = (user: userPayload ) => {
  const token = jwt.sign({ id: user.id, email: user.email}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
  return token;
};

const secret: string | undefined = process.env.JWT_SECRET;

if(!secret) { throw new InternalServerError("JWT SECRET HAS NO VALUE!")}


const verifyJWT = (token: string): userPayload=>{
  
  try {
    const payload = jwt.verify(token, secret);
    return payload as userPayload;

  } catch (e) {
    throw new AuthError('Invalid Token Provided');
  }
}

export { createJWT, comparePassword, hashPassword, verifyJWT };

