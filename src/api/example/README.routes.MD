# Routes

Definen los endpoints de la API y conectan las URLs con los controladores. Este proyecto usa **auto-configuración de rutas** que busca automáticamente archivos `*Routes.ts`.

## Para qué sirve

- ✅ Crear endpoints HTTP (GET, POST, PUT, DELETE)
- ✅ Conectar URLs con métodos de controllers
- ✅ Aplicar middleware (autenticación, validación)
- ✅ **Validar req.body** con ValidationPipe y DTOs
- ✅ Organizar la API por módulos
- ✅ **Auto-registro** mediante `setupRoutes` utility

## Arquitectura del Proyecto

Este proyecto usa **setupRoutes** (`@utils/setupRoutes.js`) que:

- ✅ **Busca automáticamente** archivos `*Routes.ts` en `src/api/`
- ✅ **Registra rutas** automáticamente en `/api/{module}`
- ✅ **Naming convention**: `ProductRoutes.ts` → `/api/products`
- ✅ **No requiere** archivo central de rutas manual

## Estructura de archivos

```
api/students/
├── studentModel.ts          # Entity de TypeORM
├── StudentService.ts        # Lógica de negocio
├── studentController.ts     # Controlador HTTP
└── StudentRoutes.ts         # Este archivo (auto-registrado)
```

## Cómo se hace

### 1. Crear archivo de rutas

```typescript
// api/students/StudentRoutes.ts
import { Router } from 'express';
import { studentController } from './studentController.js';
import { ValidationPipe } from '@middleware/validation-pipe';
import { CreateStudentDto } from './dtos/CreateStudentDto';
import { UpdateStudentDto } from './dtos/UpdateStudentDto';

const router = Router();

// ✅ Rutas CRUD base (heredadas de BaseController)
router.get('/', studentController.findAll.bind(studentController));
router.get('/:id', studentController.findOne.bind(studentController));
router.post('/', ValidationPipe(CreateStudentDto), studentController.create.bind(studentController));
router.put('/:id', ValidationPipe(UpdateStudentDto), studentController.update.bind(studentController));
router.delete('/:id', studentController.delete.bind(studentController));

// ✅ Rutas específicas del módulo
router.get('/email/:email', studentController.findByEmail.bind(studentController));
router.get('/active/all', studentController.findActiveStudents.bind(studentController));
router.get('/stats/:id', studentController.getStats.bind(studentController));

export default router;
```

### 2. Auto-registro en index.ts

```typescript
// index.ts
import { setupRoutes } from '@utils/setupRoutes.js';
import app from './app.js';

// ✅ setupRoutes busca automáticamente *Routes.ts y los registra
await setupRoutes(app);

// Resultado automático:
// - StudentRoutes.ts → /api/students
// - ProductRoutes.ts → /api/products
// - UserRoutes.ts    → /api/users
```

### 3. Naming Convention

El nombre del archivo determina la ruta base:

| Archivo          | Ruta generada |
| ---------------- | ------------- |
| StudentRoutes.ts | /api/students |
| ProductRoutes.ts | /api/products |
| UserRoutes.ts    | /api/users    |
| CourseRoutes.ts  | /api/courses  |

**Importante**: El sistema:

- Elimina "Routes" del nombre
- Convierte a minúsculas
- Agrega el prefijo `/api/`

## Configuración en app.ts

```typescript
// app.ts
import express, { type Express, type Request, type Response } from 'express';
import { SERVER_CONFIG, SERVER_MESSAGES } from '@constants/common/server.js';
import cors from 'cors';
import { httpLogger } from '@config/logger.js';
import morgan from 'morgan';

const app: Express = express();

app.use(httpLogger);
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Ruta raíz
app.get(SERVER_CONFIG.HOME, (_req: Request, res: Response) => {
  res.send(SERVER_MESSAGES.READY);
});

export default app;
```

## Métodos HTTP

| Método | Descripción                 | Ejemplo                    |
| ------ | --------------------------- | -------------------------- |
| GET    | Obtener datos               | `GET /api/students`        |
| POST   | Crear nuevo recurso         | `POST /api/students`       |
| PUT    | Actualizar recurso completo | `PUT /api/students/:id`    |
| DELETE | Eliminar recurso            | `DELETE /api/students/:id` |

## Patrones de Rutas CRUD

```typescript
// Rutas base heredadas de BaseController
GET    /api/students          // findAll()    - Obtener todos
GET    /api/students/:id      // findOne()    - Obtener uno específico
POST   /api/students          // create()     - Crear nuevo
PUT    /api/students/:id      // update()     - Actualizar
DELETE /api/students/:id      // delete()     - Eliminar

// Rutas específicas del módulo
GET    /api/students/email/:email           // findByEmail()
GET    /api/students/active/all             // findActiveStudents()
GET    /api/students/stats/:id              // getStats()
GET    /api/students/age-range?min=18&max=25 // findByAgeRange()
```

## Aplicar Middleware

```typescript
// api/students/StudentRoutes.ts
import { Router } from 'express';
import { studentController } from './studentController.js';
import { validateToken } from '@middleware/authMiddleware.js';
import { validateStudentData } from '@middleware/validation.js';

const router = Router();

// ✅ Rutas públicas (sin middleware)
router.get('/', studentController.findAll.bind(studentController));
router.get('/:id', studentController.findOne.bind(studentController));

// ✅ Aplicar middleware a partir de aquí
router.use(validateToken); // Requiere autenticación

// Rutas protegidas
router.post('/', validateStudentData, studentController.create.bind(studentController));
router.put('/:id', validateStudentData, studentController.update.bind(studentController));
router.delete('/:id', studentController.delete.bind(studentController));

// ✅ Middleware específico en una ruta
router.get('/admin/all', validateToken, checkAdmin, studentController.findAll.bind(studentController));

export default router;
```

## Convenciones del Proyecto

### Naming

- ✅ **Archivo**: `StudentRoutes.ts` (PascalCase + "Routes" suffix)
- ✅ **URLs**: `/api/students` (plural, minúsculas)
- ✅ **Parámetros**: `:id`, `:email`, `:studentId`
- ✅ **Query params**: `?page=1&limit=10`

### Estructura

```
api/students/
├── studentModel.ts          # Entity
├── StudentService.ts        # Service (extiende BaseService)
├── studentController.ts     # Controller (extiende BaseController)
├── StudentRoutes.ts         # Este archivo (auto-registrado)
└── dtos/
    ├── CreateStudentDto.ts
    └── UpdateStudentDto.ts
```

## Organización del Proyecto

```
src/
├── api/
│   ├── common/                  # BaseController y BaseService
│   ├── students/
│   │   ├── studentModel.ts
│   │   ├── StudentService.ts
│   │   ├── studentController.ts
│   │   └── StudentRoutes.ts    # Auto-registrado → /api/students
│   ├── products/
│   │   ├── productModel.ts
│   │   ├── ProductService.ts
│   │   ├── productController.ts
│   │   └── ProductRoutes.ts    # Auto-registrado → /api/products
│   └── users/
│       ├── userModel.ts
│       ├── UserService.ts
│       ├── userController.ts
│       └── UserRoutes.ts       # Auto-registrado → /api/users
├── utils/
│   └── setupRoutes.ts          # Utility que busca y registra *Routes.ts
├── app.ts                       # Configuración de Express
└── index.ts                     # Llama a setupRoutes(app)
```

## Uso de .bind()

**Importante**: Siempre usar `.bind(controller)` al asignar métodos a rutas para mantener el contexto de `this`:

```typescript
// ✅ Correcto - Con .bind()
router.get('/', studentController.findAll.bind(studentController));

// ❌ Incorrecto - Sin .bind() (pierde el contexto de this)
router.get('/', studentController.findAll);
```

## Mejores Prácticas

### ❌ NO hacer esto

```typescript
// ❌ NO - Rutas sin usar controller
router.get('/', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// ❌ NO - Rutas sin extender BaseController
router.get('/', studentsController.getAll);
router.get('/:id', studentsController.getById);
router.post('/', studentsController.createStudent);
router.put('/:id', studentsController.updateStudent);
router.delete('/:id', studentsController.deleteStudent);
// Repitiendo código que BaseController ya provee

// ❌ NO - Sin .bind()
router.get('/', studentController.findAll); // ❌ Pierde contexto

// ❌ NO - Importar manualmente en un archivo central
import studentRoutes from '@api/students/StudentRoutes.js';
import productRoutes from '@api/products/ProductRoutes.js';
// ...100 imports más
app.use('/api/students', studentRoutes);
app.use('/api/products', productRoutes);
```

### ✅ SÍ hacer esto

```typescript
// ✅ SÍ - Usar controller que extiende BaseController
import { Router } from 'express';
import { studentController } from './studentController.js';

const router = Router();

// ✅ Rutas CRUD base (heredadas)
router.get('/', studentController.findAll.bind(studentController));
router.get('/:id', studentController.findOne.bind(studentController));
router.post('/', studentController.create.bind(studentController));
router.put('/:id', studentController.update.bind(studentController));
router.delete('/:id', studentController.delete.bind(studentController));

// ✅ Rutas específicas del módulo
router.get('/email/:email', studentController.findByEmail.bind(studentController));

export default router;

// ✅ SÍ - Auto-registro con setupRoutes
// En index.ts
await setupRoutes(app); // Encuentra y registra StudentRoutes.ts automáticamente
```

## Ejemplos Avanzados

### Rutas con Query Parameters

```typescript
// GET /api/students?page=1&limit=10&sort=name
router.get('/', studentController.findAll.bind(studentController));

// En el controller
async findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 10, sort = 'id' } = req.query;

    const students = await studentService.findAll({
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      order: { [sort as string]: 'ASC' }
    });

    res.status(HTTP_STATUS.OK).json({
      message: 'Students retrieved successfully',
      data: students
    });
  } catch (error) {
    next(error);
  }
}
```

### Rutas Anidadas

```typescript
// GET /api/students/:studentId/courses
router.get('/:studentId/courses', studentController.getCourses.bind(studentController));

// POST /api/students/:studentId/courses/:courseId/enroll
router.post('/:studentId/courses/:courseId/enroll', studentController.enrollInCourse.bind(studentController));
```

### Rutas con Validación

```typescript
import { ValidationPipe } from '@middleware/validation-pipe';
import { CreateStudentDto } from './dtos/CreateStudentDto';
import { UpdateStudentDto } from './dtos/UpdateStudentDto';

// ✅ Rutas públicas (sin validación)
router.get('/', studentController.findAll.bind(studentController));
router.get('/:id', studentController.findOne.bind(studentController));

// ✅ Rutas con validación de body usando DTOs
router.post('/', ValidationPipe(CreateStudentDto), studentController.create.bind(studentController));
router.put('/:id', ValidationPipe(UpdateStudentDto), studentController.update.bind(studentController));
router.patch('/:id', ValidationPipe(UpdateStudentDto), studentController.update.bind(studentController));
```

**Notas importantes:**

- ✅ **ValidationPipe(Dto)** - Aplica en rutas que reciben body (POST/PUT/PATCH)
- ✅ **DTOs** - Crear en carpeta `dtos/` para validar estructura de datos
- ✅ **Rutas GET** - Mantener públicas salvo que requieran validación de query params
- ✅ **Autenticación** - Combinar con `validateToken` si es necesario

## Resumen

1. ✅ **Crear archivo** `{Module}Routes.ts` en `api/{module}/`
2. ✅ **Usar BaseController** para heredar rutas CRUD
3. ✅ **Usar .bind()** al asignar métodos a rutas
4. ✅ **Validar body** con `ValidationPipe(Dto)` en POST/PUT/PATCH
5. ✅ **Export default** el router
6. ✅ **setupRoutes** lo registra automáticamente
7. ✅ **Naming**: `StudentRoutes.ts` → `/api/students`
8. ✅ **Middleware**: Aplicar según necesidad (auth, validation)
9. ✅ **No importar manualmente** - el sistema busca archivos `*Routes.ts`
