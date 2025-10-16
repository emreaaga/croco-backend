import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

import applicationRouter from './routes/application.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';

const app = express();
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use('/api/application', applicationRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

export default app;
