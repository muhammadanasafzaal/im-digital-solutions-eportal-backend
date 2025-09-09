import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import timeLogRoutes from './routes/timeLogs';
import adminRoutes from './routes/admin';
import reportRoutes from './routes/reports';

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/timelogs', timeLogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);

export default app;
 