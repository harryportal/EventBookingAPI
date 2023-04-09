import { Request, Response } from 'express';
import AuthRepository from './auth.repository';




export default class AuthController {
  private static authRepository = new AuthRepository();
  
  static signUp = async (req: Request, res: Response) => {
    const {User, token} = await this.authRepository.addUser(req.body)
    res.status(201).json({ data: {User, token}, success: true });
  };

  static signIn = async (req: Request, res: Response) => {
    const token = await this.authRepository.signUser(req.body);
    res.json({ token, success:true });
  };
}

