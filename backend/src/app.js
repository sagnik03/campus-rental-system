import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

import errorMiddleware from './middlewares/error.middleware.js';
import routes from './routes/index.routes.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*'
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (_req, res) => {
  res.status(200).json({ message: 'Backend is running' });
});

app.use('/api', routes);
app.use(errorMiddleware);

export default app;
