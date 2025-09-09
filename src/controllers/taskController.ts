import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user as { userId: number; role: string };
  try {
    let tasks;
    if (user.role === 'ADMIN') {
      tasks = await prisma.task.findMany({ include: { assignee: true } });
    } else {
      tasks = await prisma.task.findMany({ where: { assignedTo: user.userId } });
    }
    res.json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
 
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user as { userId: number; role: string };
    const { title, description, status } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        assignedTo: user.userId,   // ✅ assign to current user
      },
    });

    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};



export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  try {
    const task = await prisma.task.update({ where: { id }, data: req.body });
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
