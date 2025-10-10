import { Router } from 'express';
import studentsRoutes from '@api/example/studentsRoutes.js';

const router: Router = Router();

router.use('/students', studentsRoutes);

export default router;
