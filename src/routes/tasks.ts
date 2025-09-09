import { Router } from 'express';
import { requireAuth } from '../utils/authMiddleware';
import { createTask, getTasks, updateTask } from '../controllers/taskController';

const router = Router();

router.get('/', requireAuth, getTasks);
router.post('/', requireAuth, createTask);
router.put('/:id', requireAuth, updateTask);

export default router;
 