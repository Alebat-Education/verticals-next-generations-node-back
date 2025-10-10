import { Router } from 'express';
import { studentsController } from './StudentsController.js';
import { ValidationPipe } from '@/middleware/validation-pipe.js';
import { CreateStudentDto } from './dtos/CreateStudentDto.js';

const router: Router = Router();

router.post('/', ValidationPipe(CreateStudentDto), studentsController.create);

export default router;
