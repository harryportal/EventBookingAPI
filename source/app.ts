import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { ErrorHandler } from './middleware/error';
import { Application, Request, Response } from 'express';

const app: Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('*', ErrorHandler.pagenotFound());
app.use(ErrorHandler.handle());
ErrorHandler.exceptionRejectionHandler();

export default app;
