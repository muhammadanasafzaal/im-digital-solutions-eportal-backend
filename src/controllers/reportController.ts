import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { startOfMonth, endOfMonth } from 'date-fns';

const prisma = new PrismaClient();

export const summary = async (_req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const totalTasks = await prisma.task.count({ where: { date: { gte: start, lte: end } } });
    const completed = await prisma.task.count({
      where: { date: { gte: start, lte: end }, status: 'COMPLETED' }
    });
    const inProgress = await prisma.task.count({
      where: { date: { gte: start, lte: end }, status: 'IN_PROGRESS' }
    });
 
    const timeAgg = await prisma.timeLog.aggregate({
      where: { date: { gte: start, lte: end } },
      _sum: { duration: true }
    });

    res.json({
      totalTasks,
      completed,
      inProgress,
      totalMinutes: timeAgg._sum.duration || 0
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
