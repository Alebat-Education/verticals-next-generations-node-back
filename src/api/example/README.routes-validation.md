Validación en rutas

Este archivo muestra cómo aplicar el `ValidationPipe` y los DTOs en las rutas para validar `req.body` antes de llegar al controlador.

Pautas:

- Aplica `ValidationPipe(Dto)` en aquellas rutas que reciben un body (POST / PUT / PATCH).
- Mantén las rutas de consulta (`GET`) públicas y sin `ValidationPipe` salvo que acepten query params que también quieras validar.
- Protege las rutas que deben requerir autenticación usando middlewares como `validateToken`.

Ejemplo (usando `CreateStudentDto` y `UpdateStudentDto`):

```typescript
import { Router } from 'express';
import { studentsController } from './StudentsController';
import { validateToken } from '@middleware/authMiddleware';
import { ValidationPipe } from '@middleware/validation.pipe';
import { CreateStudentDto } from './dtos/CreateStudentDto';
import { UpdateStudentDto } from './dtos/UpdateStudentDto';

const router = Router();

// 🟢 Rutas públicas
router.get('/', studentsController.consult); // GET /api/students
router.get('/:id', studentsController.consultById); // GET /api/students/:id

// 🔐 Rutas protegidas
router.use(validateToken);

// 🧩 Validaciones aplicadas con DTOs
router.post('/', ValidationPipe(CreateStudentDto), studentsController.create);
router.put('/:id', ValidationPipe(UpdateStudentDto), studentsController.update);
router.delete('/:id', studentsController.delete);

export default router;
```

Notas prácticas:

- Si `UpdateStudentDto` permite campos opcionales, asegura que el DTO use `@IsOptional()` o que el `ValidationPipe` para updates se llame con `skipMissingProperties: true`.
- Para validar query params o route params considera crear pipes/validators específicos o usar `class-transformer` + `class-validator` sobre `req.query` y `req.params`.
