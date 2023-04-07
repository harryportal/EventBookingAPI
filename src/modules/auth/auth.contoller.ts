import { prisma } from '../../utils/db/prisma';
import { Request, Response } from 'express';
import { comparePassword, hashPassword } from '../../utils/jwtAuth/jwt';
import { AuthError, ConflictError } from '../../middleware/error';
import { createJWT } from '../../utils/jwtAuth/jwt';




export default class AuthController {


  static signUp = async (req: Request, res: Response) => {
    let { firstname, lastname, email, password, contact } = req.body;

    let user = await prisma.user.findUnique({  // check if user with email already exist
      where: { email: req.body.email },
    });

    if (user) throw new ConflictError();

    user = await prisma.user.create({
      data: {
        firstname, 
        lastname,
        email,
        contact,
        password: await hashPassword(password),
      }
    });
    const User = { firstname, lastname, email, id: user.id, contact };
    const token = createJWT(user);
    res.status(201).json({ data: {User, token}, success: true });
  };



  static signIn = async (req: Request, res: Response) => {

    const user = await prisma.user.findUnique({  // check if user exist
      where: { email: req.body.email },
    });

    if(!user) throw new AuthError("Authentication Failed!");

    const isValid = await comparePassword(req.body.password, user.password);

    if (!isValid) throw new AuthError("Authentication Failed!");

    const token = createJWT(user);
  
    res.json({ token });
  };
}
