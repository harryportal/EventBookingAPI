import RequestValidator from '../middleware/validation';
import { Router } from 'express';
import AuthController from '../controllers/Auth';
import { SignUp, SignIn} from '../serializers/Auth';
import GoogleOauthController from '../controllers/Oauth';
import 'express-async-errors';

const authRouter = Router();

authRouter.post('/signup', RequestValidator.validate(SignUp), AuthController.signUp);
authRouter.post('/login', RequestValidator.validate(SignIn), AuthController.signIn);
authRouter.get('/google',  GoogleOauthController.googleOauthHandler);
authRouter.get('/google-login',  GoogleOauthController.getAuthorizationCode);

export default authRouter;
