import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body

    // ❌ Block if someone tries to register as EMPLOYEE or CLIENT
    if (role && role !== 'ADMIN') {
      res.status(403).json({ error: 'Only admins can self-register. Employees must be added by an admin.' })
      return
    } 

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN', // ✅ force role
      },
    })

    res.json({ message: 'Admin registered successfully', user })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const user = await prisma.employee.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
