import { Router } from 'express';
import { listUsers, changeUserRole, assignTaskToUser, getEmployees, addEmployee } from '../controllers/adminController';
import { requireAuth, requireAdmin } from '../utils/authMiddleware';

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/users', listUsers);
router.post('/users/:id/role', changeUserRole);
router.post('/tasks/:id/assign', assignTaskToUser);
router.get('/employees', requireAdmin, getEmployees);
router.post('/employees', requireAdmin, addEmployee)

 
export default router;
