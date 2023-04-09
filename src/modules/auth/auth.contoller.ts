import { Request, Response } from 'express';
import AuthRepository from './auth.repository';
import { createJWT } from '../../utils/jwtAuth/jwt';




export default class AuthController {
  private static authRepository = new AuthRepository();
  
  static signUp = async (req: Request, res: Response) => {
    const user = await this.authRepository.addUser(req.body)
    const token = createJWT(user);
    res.status(201).json({ data: {user, token}, success: true });
  };

  static signIn = async (req: Request, res: Response) => {
    const user = await this.authRepository.signUser(req.body);
    const token = createJWT(user);
    res.json({ token, success:true });
  };
}

