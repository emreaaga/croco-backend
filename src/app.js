import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import applicationRouter from './routes/application.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import { globalLimiter } from './config/rateLimiter.js';

const app = express();
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(globalLimiter);

app.use('/api/applications', applicationRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

export default app;
