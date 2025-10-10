# Constants

Valores que no cambian. En vez de escribir `200` o strings mágicos por todos lados, los defines una vez aquí.

## 📁 Estructura del Proyecto

```
constants/
├── README.md
├── common/              # Constantes comunes del sistema
│   ├── http.ts          # Status codes HTTP y mensajes de éxito
│   ├── models.ts        # Entidades exportadas y nombres de modelos
│   └── server.ts        # Configuración del servidor
└── errors/              # Mensajes y clases de error
    ├── common.ts        # Errores comunes de la aplicación
    ├── error-messages.ts # Mensajes de error descriptivos
    ├── errors.ts        # Clases de error personalizadas
    └── server.ts        # Errores específicos del servidor
```

---

## Regla Simple

**Si escribes el mismo número o string más de 2 veces → mételo en constants**

---

## Para qué sirve

- ✅ **Evitar magic numbers**: `HTTP_STATUS.OK` es más claro que `200`
- ✅ **Evitar magic strings**: `MODELS_NAMES.PRODUCT` en vez de `'Product'`
- ✅ **Cambios centralizados**: Cambias un valor y se actualiza en todo el proyecto
- ✅ **Sin errores de typo**: El compilador te avisa si escribes mal
- ✅ **IntelliSense**: Autocompletado de todos los valores disponibles
- ✅ **Type-safe**: TypeScript valida que uses valores correctos

---

## 📄 common/http.ts

Status codes HTTP y mensajes de éxito estándar.

### Contenido

```typescript
// constants/common/http.ts

// Status codes HTTP
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Mensajes de éxito (funciones que generan mensajes dinámicos)
export const SUCCESS_RESOURCES_RETRIEVED = (resource: string): string => `${resource}s retrieved successfully`;

export const SUCCESS_RESOURCE_CREATED = (resource: string): string => `${resource} created successfully`;

export const SUCCESS_RESOURCE_UPDATED = (resource: string): string => `${resource} updated successfully`;

export const SUCCESS_RESOURCE_DELETED = (resource: string): string => `${resource} deleted successfully`;
```

### Uso

```typescript
import { HTTP_STATUS, SUCCESS_RESOURCE_CREATED } from '@constants/common/http.js';

// En controllers
res.status(HTTP_STATUS.CREATED).json({
  message: SUCCESS_RESOURCE_CREATED('Student'),
  data: student,
});

res.status(HTTP_STATUS.NOT_FOUND).json({
  error: 'Resource not found',
});
```

---

## 📄 common/models.ts

Registro central de entidades de TypeORM y nombres de modelos.

### Contenido

```typescript
// constants/common/models.ts
import { Product } from '@/api/products/productModel.js';

// Todas las entidades para TypeORM
export const EXPORTED_MODELS = [
  Product,
  // Agregar más entidades aquí cuando las crees
] as const;

// Nombres de modelos para usar en controllers
export const MODELS_NAMES = {
  PRODUCT: 'Product',
  // Agregar más nombres aquí
} as const;
```

### Para qué sirve

- ✅ **Registro central de entidades**: TypeORM las carga desde aquí
- ✅ **Nombres consistentes**: Usar en controllers con `MODELS_NAMES`
- ✅ **Single source of truth**: Un solo lugar para agregar nuevas entidades

### Uso

```typescript
// En connection.ts
import { EXPORTED_MODELS } from '@constants/common/models.js';

export const AppDataSource = new DataSource({
  // ...
  entities: EXPORTED_MODELS,
});

// En controllers
import { MODELS_NAMES } from '@constants/common/models.js';

export class ProductController extends BaseController<Product> {
  constructor() {
    super(productService, MODELS_NAMES.PRODUCT);
  }
}
```

**Importante**: Cada vez que crees una nueva entidad:

1. Importarla en `models.ts`
2. Agregarla a `EXPORTED_MODELS`
3. Agregar su nombre a `MODELS_NAMES`

---

## 📄 common/server.ts

Configuración del servidor y mensajes relacionados.

### Contenido

```typescript
// constants/common/server.ts

// Configuración del servidor
export const SERVER_CONFIG = {
  DEFAULT_DB_TYPE: 'mysql',
  HOME: '/',
  DEFAULT_PORT: 3000,
} as const;

// Ambientes de ejecución
export const SERVER_ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

// Mensajes del servidor
export const SERVER_MESSAGES = {
  READY: 'Server is ready',
  LISTENING: 'listening',
  STARTING: (port: number) => `Server running on http://localhost:${port}`,
  SUCCESS_DB_CONNECTED: 'Database connected successfully',
} as const;
```

### Uso

```typescript
import { SERVER_CONFIG, SERVER_ENVIRONMENTS, SERVER_MESSAGES } from '@constants/common/server.js';

// En app.ts
app.get(SERVER_CONFIG.HOME, (_req, res) => {
  res.send(SERVER_MESSAGES.READY);
});

// En connection.ts
logging: CONFIG.NODE_ENV === SERVER_ENVIRONMENTS.PRODUCTION ? false : true;

// En index.ts
logger.info(SERVER_MESSAGES.STARTING(port));
```

---

## 📄 errors/common.ts

Errores comunes de la aplicación.

### Contenido

```typescript
// constants/errors/common.ts

// Mensajes de error comunes
export const ERROR_INVALID_ID = 'Invalid ID format';

export const ERROR_RESOURCE_NOT_FOUND = (resource: string, id: string | number): string =>
  `${resource} with ID ${id} not found`;

export const ERROR_VALIDATION_FAILED = 'Validation failed';

export const ERROR_UNAUTHORIZED = 'Unauthorized access';

export const ERROR_FORBIDDEN = 'Forbidden action';
```

### Uso

```typescript
import { ERROR_INVALID_ID, ERROR_RESOURCE_NOT_FOUND } from '@constants/errors/common.js';
import { ValidationError, NotFoundError } from '@constants/errors/errors.js';

// En controllers
if (!isValidId(id)) {
  throw new ValidationError(ERROR_INVALID_ID);
}

if (!resource) {
  throw new NotFoundError(ERROR_RESOURCE_NOT_FOUND('Student', id));
}
```

---

## 📄 errors/errors.ts

Clases de error personalizadas para la aplicación.

### Contenido

```typescript
// constants/errors/errors.ts

// Clase base para errores de la aplicación
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error de validación (400)
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

// Error de recurso no encontrado (404)
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

// Error de autenticación (401)
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

// Error de permisos (403)
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

// Error de conflicto (409)
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
```

### Uso

```typescript
import { ValidationError, NotFoundError, UnauthorizedError, ForbiddenError } from '@constants/errors/errors.js';

// Lanzar errores en services
if (age < 16) {
  throw new ValidationError('Age must be at least 16');
}

if (!student) {
  throw new NotFoundError(`Student with ID ${id} not found`);
}

if (!token) {
  throw new UnauthorizedError('Token required');
}

if (user.role !== 'admin') {
  throw new ForbiddenError('Admin access required');
}
```

---

## 📄 errors/server.ts

Errores específicos del servidor y base de datos.

### Contenido

```typescript
// constants/errors/server.ts

export const ERROR = 'error';

export const ERROR_SERVER = (error: string): string => `Server error: ${error}`;

export const ERROR_DB_CONNECTION_FAILED = 'Failed to connect to database';

export const ERROR_DB_MISSING_ENV_VARS = 'Missing required database environment variables';

export const ERROR_INVALID_PORT = 'Invalid port number';

export const ERROR_PORT_IN_USE = (port: number): string => `Port ${port} is already in use`;

export const ERROR_DATA_SOURCE_NOT_INITIALIZED = 'DataSource is not initialized';
```

### Uso

```typescript
import {
  ERROR_DB_CONNECTION_FAILED,
  ERROR_DATA_SOURCE_NOT_INITIALIZED
} from '@constants/errors/server.js';

// En connection.ts
} catch (error) {
  logger.fatal({ err: error }, ERROR_DB_CONNECTION_FAILED);
  process.exit(1);
}

// En services
if (!AppDataSource?.isInitialized) {
  throw new Error(ERROR_DATA_SOURCE_NOT_INITIALIZED);
}
```

---

## ✅ Mejores Prácticas

### ❌ NO hacer esto

```typescript
// ❌ NO - Magic numbers
res.status(200).json({ message: 'OK' });
res.status(404).json({ error: 'Not found' });

// ❌ NO - Magic strings
if (env === 'production') { }
throw new Error('Student not found');

// ❌ NO - Mensajes hardcodeados
res.json({ message: 'Student created successfully' });

// ❌ NO - Entidades hardcodeadas
entities: [Product, User, Student],

// ❌ NO - Errores genéricos
throw new Error('Invalid data');
res.status(400).json({ error: 'Bad request' });
```

### ✅ SÍ hacer esto

```typescript
// ✅ SÍ - Usar constantes HTTP
import { HTTP_STATUS, SUCCESS_RESOURCE_CREATED } from '@constants/common/http.js';
res.status(HTTP_STATUS.OK).json({ message: 'OK' });
res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Not found' });

// ✅ SÍ - Usar constantes de server
import { SERVER_ENVIRONMENTS } from '@constants/common/server.js';
if (CONFIG.NODE_ENV === SERVER_ENVIRONMENTS.PRODUCTION) { }

// ✅ SÍ - Usar funciones de mensajes
res.status(HTTP_STATUS.CREATED).json({
  message: SUCCESS_RESOURCE_CREATED('Student'),
  data: student
});

// ✅ SÍ - Usar EXPORTED_MODELS
import { EXPORTED_MODELS } from '@constants/common/models.js';
entities: EXPORTED_MODELS,

// ✅ SÍ - Usar clases de error personalizadas
import { ValidationError, NotFoundError } from '@constants/errors/errors.js';
import { ERROR_RESOURCE_NOT_FOUND } from '@constants/errors/common.js';

throw new ValidationError('Invalid age value');
throw new NotFoundError(ERROR_RESOURCE_NOT_FOUND('Student', id));
```

---

## 🔄 Cómo Agregar Nuevas Constantes

### 1. Identificar el tipo

- **HTTP/Success**: `common/http.ts`
- **Configuración**: `common/server.ts`
- **Entidades**: `common/models.ts`
- **Errores comunes**: `errors/common.ts`
- **Errores de servidor**: `errors/server.ts`

### 2. Agregar la constante

```typescript
// common/http.ts
export const SUCCESS_RESOURCE_ACTIVATED = (resource: string): string => `${resource} activated successfully`;

// errors/common.ts
export const ERROR_DUPLICATE_EMAIL = 'Email already exists';
```

### 3. Usar la constante

```typescript
import { SUCCESS_RESOURCE_ACTIVATED } from '@constants/common/http.js';
import { ERROR_DUPLICATE_EMAIL } from '@constants/errors/common.js';

res.json({ message: SUCCESS_RESOURCE_ACTIVATED('Student') });
throw new ConflictError(ERROR_DUPLICATE_EMAIL);
```

---

## 📝 Resumen

1. ✅ **Usar constantes** para valores repetidos
2. ✅ **HTTP_STATUS** para códigos de estado
3. ✅ **SUCCESS\_\* functions** para mensajes de éxito
4. ✅ **ERROR\_\* constants** para mensajes de error
5. ✅ **Clases de error** personalizadas (ValidationError, NotFoundError, etc.)
6. ✅ **EXPORTED_MODELS** para registrar entidades
7. ✅ **MODELS_NAMES** para nombres en controllers
8. ✅ **as const** para hacer constantes inmutables
9. ✅ **Funciones** para mensajes dinámicos
10. ✅ **Organizar** por categoría (common/, errors/)
