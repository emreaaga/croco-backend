import express from 'express';
import morgan from 'morgan';
import applicationRouter from './routes/application.routes.js';

const app = express();
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/application', applicationRouter);

export default app;
