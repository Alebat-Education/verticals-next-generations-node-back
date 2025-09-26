# Routes

Definen los endpoints de la API y conectan las URLs con los controladores.

## Para qué sirve

- Crear endpoints HTTP (GET, POST, PUT, DELETE)
- Conectar URLs con controladores
- Aplicar middleware (autenticación, validación)
- Organizar la API

## Cómo se hace

```typescript
import { Router } from 'express';
import { studentsController } from '@controllers/studentsController';
import { validateToken } from '@middleware/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/', studentsController.consult); // GET /api/students
router.get('/:id', studentsController.consultById); // GET /api/students/:id

// Rutas protegidas (requieren token)
router.use(validateToken); // Se aplica a todas las rutas siguientes

router.post('/', studentsController.create); // POST /api/students
router.put('/:id', studentsController.update); // PUT /api/students/:id
router.delete('/:id', studentsController.delete); // DELETE /api/students/:id

export default router;
```

## Archivo principal de rutas

```typescript
// routes/index.ts
import { Router } from 'express';
import studentsRoutes from '@routes/studentsRoutes';
import professorsRoutes from '@routes/professorsRoutes';
import coursesRoutes from '@routes/coursesRoutes';

const router = Router();

// Conectar rutas
router.use('/students', studentsRoutes);
router.use('/professors', professorsRoutes);
router.use('/courses', coursesRoutes);

export default router;
```

## Integración en app.ts

```typescript
import express from 'express';
import routes from '@routes/index';

const app = express();

app.use(express.json());
app.use('/api', routes); // Todas las rutas tendrán prefijo /api

export default app;
```

## Métodos HTTP

- **GET** - Obtener datos
- **POST** - Crear nuevo recurso
- **PUT** - Actualizar recurso completo
- **DELETE** - Eliminar recurso

## Patrones comunes

```typescript
GET    /api/students          // Obtener todos
GET    /api/students/:id      // Obtener uno específico
POST   /api/students          // Crear nuevo
PUT    /api/students/:id      // Actualizar
DELETE /api/students/:id      // Eliminar
```

## Convenciones

- Archivo: `studentsRoutes.ts`
- URLs: `/api/students` (plural, minúsculas)
- Parámetros: `:id`, `:studentId`
