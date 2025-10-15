import express from 'express';
import morgan from 'morgan';
import applicationRouter from './routes/application.routes.js';
import authRouter from './routes/auth.routes.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/application', applicationRouter);
app.use('/api/auth', authRouter);

export default app;
