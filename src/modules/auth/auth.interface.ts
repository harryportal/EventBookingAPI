import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: any;
}


export interface User {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  contact: string
}


interface IUser extends Partial<User> {
  firstname?: string
}