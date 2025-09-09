import { Router } from 'express';
import { requireAuth } from '../utils/authMiddleware';
import { createTimeLog, getTimeLogs } from '../controllers/timeLogController';

const router = Router();

router.get('/', requireAuth, getTimeLogs);
router.post('/', requireAuth, createTimeLog);

export default router;
 