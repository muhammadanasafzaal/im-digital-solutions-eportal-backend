import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

export const listUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.employee.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}; 

export const changeUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { role, isActive }: { role: Role; isActive?: boolean } = req.body;
    const user = await prisma.employee.update({ where: { id }, data: { role, isActive } });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const assignTaskToUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = Number(req.params.id);
    const { userId }: { userId: number } = req.body;
    const task = await prisma.task.update({ where: { id: taskId }, data: { assignedTo: userId } });
    res.json(task);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get all employees (for task assignment)
export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true, role: true },
    })
    res.json(employees)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export const addEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || Role.EMPLOYEE,
      },
    })

    res.json(employee)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}