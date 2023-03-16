import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { ErrorHandler } from './middleware/error';
import { Application, Request, Response } from 'express';
import { multerUpload } from './utils/multer';
import EventController from './controllers/Events';
//import cloudinaryInstance from './service/cloudinary';

const app: Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/",  multerUpload.single("save__to__cloudinary"), EventController.addImage)


app.use('*', ErrorHandler.pagenotFound());
app.use(ErrorHandler.handle());
ErrorHandler.exceptionRejectionHandler();

export default app;
