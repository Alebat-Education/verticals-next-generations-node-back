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
import { StudentsService } from '@api/example/StudentsService';
import { HTTP_STATUS } from '@constants/httpStatus';
import type { CreateStudentDto } from '@api/example/dtos';

class StudentsController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const studentData: CreateStudentDto = req.body;
      const student = await StudentsService.create(studentData);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Student created successfully',
        data: student,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }
}

export const studentsController = new StudentsController();
```

## Estructura de archivos

```
api/example/
├── StudentsController.ts    # Este archivo
├── StudentsService.ts       # Lógica de negocio
├── Student.ts              # Modelo/Entity
├── studentsRoutes.ts       # Rutas
└── studentsController.test.ts # Tests del módulo
```

## Mejores prácticas

### ❌ No hacer en controladores

- Lógica de negocio compleja
- Consultas directas a base de datos
- Validaciones de negocio
- Cálculos complejos

### ✅ Sí hacer en controladores

- Manejar requests/responses HTTP
- Validar formato de entrada
- Llamar a servicios
- Manejar errores HTTP
- Devolver respuestas JSON

### Ejemplo completo

```typescript
import type { Request, Response } from 'express';
import { StudentsService } from '@api/example/StudentsService';
import { HTTP_STATUS } from '@constants/httpStatus';
import type { CreateStudentDto } from '@api/example/dtos';

class StudentsController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const studentData: CreateStudentDto = req.body;
      const student = await StudentsService.create(studentData);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Student created successfully',
        data: student,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  }
}
```
