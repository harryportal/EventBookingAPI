import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: any;
}


export interface User {
  email: string;
  phone: string;
  username: string;
}
