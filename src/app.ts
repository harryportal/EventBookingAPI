import express from "express";
import morgan from 'morgan';
import cors from 'cors';
import { ErrorHandler } from './middleware/error';
import { Application } from 'express';
import eventRouter from "./modules/event/event.router";
import authRouter from "./modules/auth/auth.router";
import bodyParser from 'body-parser';


const app: Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1/events/', eventRouter);
app.use('/api/v1/auth', authRouter);



app.use('*', ErrorHandler.pagenotFound());
app.use(ErrorHandler.handle());
ErrorHandler.exceptionRejectionHandler();

export default app;
