# Controllers

Los controladores manejan las peticiones HTTP y devuelven respuestas. Conectan las rutas con la lógica de negocio.

## Para qué sirve

- Recibir requests HTTP
- Procesar datos
- Llamar a modelos/servicios
- Devolver respuestas JSON

## Cómo se hace

```typescript
import type { Request, Response } from 'express';
import { Student } from '@models/studentsModel';

class StudentsController {
  constructor() {}

  async consult(req: Request, res: Response) {
    try {
      const students = await Student.find();
      res.status(200).send({ msg: students, total: students.length });
    } catch {
      res.status(500).send({ error: "Couldn't retrieve students" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { body } = req;
      if (!body) return res.status(400).send({ msg: 'No data provided' });

      const createdStudent = await Student.create({
        dni: body?.dni,
        name: body?.name,
        lastname: body?.lastname,
        age: body?.age,
      });

      await createdStudent.save();
      res.status(201).send({ msg: 'student created', student: createdStudent });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send({ msg: error.message });
      }
    }
  }
}

export const studentsController = new StudentsController();
```
