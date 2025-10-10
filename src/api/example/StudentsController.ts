import type { Request, Response } from 'express';
import type { CreateStudentDto } from '@api/example/dtos/CreateStudentDto.ts';
import type { IStudent } from '@api/example/IStudent.ts';

let counter = 1;
const DB: IStudent[] = [];

export const studentsController = {
  async create(req: Request<{}, {}, CreateStudentDto>, res: Response) {
    // req.body ya viene validado por ValidationPipe
    const body = req.body as unknown as CreateStudentDto;
    const newStudent: IStudent = {
      id: counter++,
      nombre: body.nombre,
      email: body.email,
      grupo: body.grupo ?? '',
    };
    DB.push(newStudent);
    res.status(201).json({ message: 'Estudiante creado exitosamente', data: newStudent });
  },
};
