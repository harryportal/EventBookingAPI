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

export interface userPayload{
  id: string,
  email: string
}


