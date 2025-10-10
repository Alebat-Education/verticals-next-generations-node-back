# Controllers

Los controladores manejan las peticiones HTTP y devuelven respuestas. En este proyecto, # Controllers

Manejan peticiones HTTP y devuelven respuestas. **Todos deben extender `BaseController`** para heredar endpoints CRUD.

## Para qué sirve

- Recibir requests HTTP y va## Endpoints Heredados

| Método | Ruta | Controller | Respuesta     |
| ------ | ---- | ---------- | ------------- |
| GET    | /    | findAll()  | 200 + array   |
| GET    | /:id | findOne()  | 200 + objeto  |
| POST   | /    | create()   | 201 + objeto  |
| PUT    | /:id | update()   | 200 + objeto  |
| DELETE | /:id | delete()   | 200 + mensaje |

## Constantes

```typescript
import { HTTP_STATUS, SUCCESS_RESOURCE_CREATED } from '@constants/common/http.js';
import { ERROR_RESOURCE_NOT_FOUND } from '@constants/errors/common.js';
import { NotFoundError, ValidationError } from '@constants/errors/errors.js';
```

## Mejores Prácticas

✅ **SÍ hacer**

- Extender `BaseController<T>`
- Usar constantes para mensajes y status codes
- Delegar lógica al service
- Usar `next(error)` para errores
- Usar `.bind()` en rutas

❌ **NO hacer**

- Lógica de negocio en controllers
- Consultas directas a base de datos
- Validaciones de negocio
- Responder errores sin `next(error)`Llamar a services para lógica de negocio
- Devolver respuestas JSON consistentes
- Manejar errores con `next(error)`

## Arquitectura

**BaseController** proporciona 5 endpoints CRUD listos: `findAll` (GET /), `findOne` (GET /:id), `create` (POST /), `update` (PUT /:id), `delete` (DELETE /:id).

## Cómo se hace

```typescript
// api/students/studentController.ts
import { BaseController } from '@common/GlobalController.js';
import { studentService } from './StudentService.js';
import { MODELS_NAMES } from '@constants/common/models.js';

export class StudentController extends BaseController<Student> {
  constructor() {
    super(studentService, MODELS_NAMES.STUDENT);
  }

  // Endpoints específicos
  async findByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.params;
      const student = await studentService.findByEmail(email);

      if (!student) {
        throw new NotFoundError(`Student with email ${email} not found`);
      }

      res.status(HTTP_STATUS.OK).json({
        message: 'Student retrieved successfully',
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const studentController = new StudentController();
```

## Definir rutas

```typescript

## Para qué sirve

- ✅ Recibir requests HTTP y validar parámetros
- ✅ Llamar a services para lógica de negocio
- ✅ Devolver respuestas JSON consistentes
- ✅ Manejar errores HTTP apropiadamente
- ✅ **Heredar endpoints CRUD automáticamente** desde `BaseController`

## Arquitectura del Proyecto

Este proyecto usa **BaseController** (`@common/GlobalController.js`) que proporciona:

- ✅ **5 endpoints CRUD** listos para usar (GET, POST, PUT, DELETE)
- ✅ **Validaciones automáticas** de IDs y recursos
- ✅ **Respuestas consistentes** con formato `ApiSuccessResponse`
- ✅ **Error handling** centralizado con `next(error)`

## Estructura de archivos

```

api/students/
├── studentModel.ts # Entity de TypeORM
├── StudentService.ts # Lógica de negocio (extiende BaseService)
├── studentController.ts # Este archivo (extiende BaseController)
├── StudentRoutes.ts # Definición de rutas
└── dtos/
├── CreateStudentDto.ts
└── UpdateStudentDto.ts

````

## Cómo se hace

### 1. Extender BaseController

```typescript
// api/students/studentController.ts
import { BaseController } from '@common/GlobalController.js';
import { studentService } from './StudentService.js';
import { MODELS_NAMES } from '@constants/common/models.js';
import type { Student } from './studentModel.js';
import type { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '@constants/common/http.js';
import { NotFoundError } from '@constants/errors/errors.js';

export class StudentController extends BaseController<Student> {
  constructor() {
    // Pasar el service y el nombre del recurso
    super(studentService, MODELS_NAMES.STUDENT);
  }

  // ✅ Endpoints CRUD heredados automáticamente:
  // - findAll()   -> GET /
  // - findOne()   -> GET /:id
  // - create()    -> POST /
  // - update()    -> PUT /:id
  // - delete()    -> DELETE /:id

  // Agrega tus endpoints específicos aquí
  async findByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.params;
      const student = await studentService.findByEmail(email);

      if (!student) {
        throw new NotFoundError(`Student with email ${email} not found`);
      }

      res.status(HTTP_STATUS.OK).json({
        message: 'Student retrieved successfully',
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  async findActiveStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const students = await studentService.findActiveStudents();

      res.status(HTTP_STATUS.OK).json({
        message: 'Active students retrieved successfully',
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const studentController = new StudentController();
````

### 2. Definir las rutas

```typescript
// api/students/StudentRoutes.ts
import { Router } from 'express';
import { studentController } from './studentController.js';

const router = Router();

// Rutas CRUD (heredadas)
router.get('/', studentController.findAll.bind(studentController));
router.get('/:id', studentController.findOne.bind(studentController));
router.post('/', studentController.create.bind(studentController));
router.put('/:id', studentController.update.bind(studentController));
router.delete('/:id', studentController.delete.bind(studentController));

// Rutas específicas
router.get('/email/:email', studentController.findByEmail.bind(studentController));

export default router;
```

## Formato de Respuestas

```typescript
// Éxito
{ "message": "Students retrieved successfully", "data": [...] }

// Error
{ "error": "Student not found", "statusCode": 404 }
```

## Formato de Respuestas

Todas las respuestas usan el formato `ApiSuccessResponse`:

```typescript
// Respuesta exitosa
{
  "message": "Students retrieved successfully",
  "data": [...] | {...}
}

// Error (manejado por errorHandler middleware)
{
  "error": "Student not found",
  "statusCode": 404
}
```

## Mejores prácticas

### ❌ NO hacer en controladores

```typescript
// ❌ NO - Lógica de negocio en controller
async create(req, res) {
  const { email, age } = req.body;

  // ❌ Validación de negocio
  if (age < 18) {
    return res.status(400).json({ error: 'Too young' });
  }

  // ❌ Consulta directa a base de datos
  const existing = await Student.findOne({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: 'Email exists' });
  }

  // ❌ Operación de base de datos
  const student = await Student.create(req.body).save();
  res.json(student);
}

// ❌ NO - Sin extender BaseController
class StudentController {
  // Repitiendo código CRUD que ya existe...
}

// ❌ NO - Sin usar next(error)
catch (error) {
  res.status(500).json({ error: error.message });
}
```

### ✅ SÍ hacer en controladores

```typescript
// ✅ SÍ - Extender BaseController
export class StudentController extends BaseController<Student> {
  constructor() {
    super(studentService, MODELS_NAMES.STUDENT);
  }

  // ✅ SÍ - Delegar lógica al service
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Solo llamar al service, él tiene la lógica
      const student = await studentService.create(req.body);

      res.status(HTTP_STATUS.CREATED).json({
        message: SUCCESS_RESOURCE_CREATED(this.resourceName),
        data: student,
      });
    } catch (error) {
      // ✅ Pasar error al middleware global
      next(error);
    }
  }

  // ✅ SÍ - Usar constantes para mensajes y status codes
  async findByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.params;
      const student = await studentService.findByEmail(email);

      if (!student) {
        throw new NotFoundError(ERROR_RESOURCE_NOT_FOUND('Student', email));
      }

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_RESOURCES_RETRIEVED('Student'),
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }
}

// ✅ SÍ - Exportar instancia única
export const studentController = new StudentController();
```

## Validaciones Automáticas

BaseController incluye validaciones automáticas:

- ✅ **ID válido**: Verifica que el ID sea numérico y positivo
- ✅ **Recurso existe**: Retorna 404 si no encuentra el recurso
- ✅ **Error handling**: Todos los errores se pasan a `next(error)`

## Endpoints Heredados

Al extender `BaseController`, obtienes estos endpoints automáticamente:

| Método | Ruta | Descripción          | Respuesta            |
| ------ | ---- | -------------------- | -------------------- |
| GET    | /    | Obtener todos        | 200 OK + array       |
| GET    | /:id | Obtener uno por ID   | 200 OK + objeto      |
| POST   | /    | Crear nuevo          | 201 CREATED + objeto |
| PUT    | /:id | Actualizar existente | 200 OK + objeto      |
| DELETE | /:id | Eliminar por ID      | 200 OK + mensaje     |

## Constantes a usar

```typescript
// Status codes
import { HTTP_STATUS } from '@constants/common/http.js';

// Mensajes de éxito
import {
  SUCCESS_RESOURCE_CREATED,
  SUCCESS_RESOURCE_UPDATED,
  SUCCESS_RESOURCES_RETRIEVED,
} from '@constants/common/http.js';

// Errores
import { ERROR_INVALID_ID, ERROR_RESOURCE_NOT_FOUND } from '@constants/errors/common.js';

// Clases de error
import { NotFoundError, ValidationError } from '@constants/errors/errors.js';
```

## Resumen

1. ✅ **Siempre extender** `BaseController<T>`
2. ✅ **Pasar service y resourceName** al constructor
3. ✅ **Usar constantes** para mensajes y status codes
4. ✅ **Delegar lógica** al service, no ponerla en el controller
5. ✅ **Usar next(error)** para manejo de errores
6. ✅ **Usar .bind()** al asignar métodos a rutas
7. ✅ **Exportar instancia** única del controller

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
