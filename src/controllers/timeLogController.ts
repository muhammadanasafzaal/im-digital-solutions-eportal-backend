import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTimeLogs = async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user as { userId: number; role: string };
    try {
        let logs;
        if (user.role === 'ADMIN') {
            logs = await prisma.timeLog.findMany({ include: { employee: true } });
        } else {
            logs = await prisma.timeLog.findMany({ where: { employeeId: user.userId } });
        }
        res.json(logs);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
 
export const createTimeLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as { userId: number; role: string }
    const { timeIn, timeOut, description } = req.body

    const duration = Math.floor(
      (new Date(timeOut).getTime() - new Date(timeIn).getTime()) / (1000 * 60)
    )

    const log = await prisma.timeLog.create({
      data: {
        employeeId: user.userId,
        date: new Date(timeIn),
        timeIn: new Date(timeIn),
        timeOut: new Date(timeOut),
        duration,
        description,
      },
    })

    res.json(log)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}


