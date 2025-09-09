import { Router } from 'express';
import { summary } from '../controllers/reportController';
import { requireAuth } from '../utils/authMiddleware';

const router = Router();

router.get('/summary', requireAuth, summary);

export default router;
 