import RequestValidator from '../../common/validation';
import { Router } from 'express';
import AuthController from './auth.contoller';
import { SignIn, SignUp } from './auth.validation';
import 'express-async-errors';

const authRouter = Router();

authRouter.post('/signup', RequestValidator.validate(SignUp), AuthController.signUp);
authRouter.post('/login', RequestValidator.validate(SignIn), AuthController.signIn);


export default authRouter;
