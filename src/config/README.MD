# Configuration

Configuración de la aplicación, base de datos, variables de entorno y logging.

## 📁 Archivos

- **index.ts** - Variables de entorno centralizadas
- **connection.ts** - TypeORM DataSource con MySQL replication
- **logger.ts** - Configuración de pino logger para HTTP y aplicación

---

## 🔧 index.ts - Variables de Entorno

Centraliza todas las variables de entorno de la aplicación.

### Para qué sirve

- ✅ **Centralizar configuración**: Un solo lugar para todas las variables
- ✅ **Type-safe**: TypeScript valida las variables
- ✅ **Validación temprana**: Falla rápido si faltan variables críticas
- ✅ **Fácil de usar**: Importar `CONFIG` en lugar de `process.env`

### Cómo se usa

```typescript
// config/index.ts
import 'dotenv/config';

export const CONFIG = {
  // Server
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DB_HOST_WRITING: process.env.DB_HOST_WRITING!,
  DB_HOST_READING: process.env.DB_HOST_READING!,
  DB_PORT: process.env.DB_PORT || '3306',
  DB_USERNAME: process.env.DB_USERNAME!,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME!,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const;

// Validar variables críticas
const requiredVars = ['DB_HOST_WRITING', 'DB_HOST_READING', 'DB_USERNAME', 'DB_NAME'];
requiredVars.forEach(varName => {
  if (!CONFIG[varName as keyof typeof CONFIG]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
```

### Uso en el proyecto

```typescript
// En cualquier archivo
import { CONFIG } from '@config/index.js';

const port = CONFIG.PORT;
const dbHost = CONFIG.DB_HOST_WRITING;
const env = CONFIG.NODE_ENV;
```

---

## 🗄️ connection.ts - TypeORM DataSource

Configura la conexión a MySQL con soporte para replicación master-slave.

### Para qué sirve

- ✅ **Replicación MySQL**: Separar lectura/escritura para mejor performance
- ✅ **Master-Slave**: Escrituras al master, lecturas a slaves
- ✅ **Validación de puerto**: Convierte y valida el puerto de string a number
- ✅ **Logging condicional**: Deshabilitado en producción
- ✅ **Auto-registro de entidades**: Desde `EXPORTED_MODELS` constant

### Arquitectura de Replicación

```
┌─────────────────┐
│   Application   │
└────────┬────────┘
         │
         ├──────────────────────────────┐
         │                              │
    WRITE (INSERT,                 READ (SELECT)
    UPDATE, DELETE)                     │
         │                              │
         v                              v
┌────────────────┐            ┌────────────────┐
│  Master Server │            │  Slave Server  │
│  (WRITING)     │────────────│  (READING)     │
│  DB_HOST_WRITING│  Replica  │  DB_HOST_READING│
└────────────────┘            └────────────────┘
```

### Cómo se hace

```typescript
// config/connection.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CONFIG } from '@config/index.js';
import { ERROR_DB_MISSING_ENV_VARS, ERROR_DB_CONNECTION_FAILED, ERROR_INVALID_PORT } from '@errors/server.js';
import { EXPORTED_MODELS } from '@constants/common/models.js';
import { SERVER_CONFIG, SERVER_ENVIRONMENTS, SERVER_MESSAGES } from '@constants/common/server.js';
import { logger } from '@config/logger.js';

// Extraer variables de configuración
const { DB_HOST_READING, DB_HOST_WRITING, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = CONFIG;

// Validar variables requeridas
if (!DB_HOST_READING || !DB_HOST_WRITING || !DB_PORT || !DB_USERNAME || !DB_NAME) {
  throw new Error(ERROR_DB_MISSING_ENV_VARS);
}

// Validar y convertir puerto
const parsedPort = Number(DB_PORT);
if (isNaN(parsedPort)) {
  throw new Error(ERROR_INVALID_PORT);
}

// Configurar DataSource con replicación
export const AppDataSource = new DataSource({
  type: SERVER_CONFIG.DEFAULT_DB_TYPE as 'mysql',
  replication: {
    master: {
      // Servidor de escritura
      host: DB_HOST_WRITING,
      port: parsedPort,
      username: DB_USERNAME,
      password: DB_PASSWORD || '',
      database: DB_NAME,
    },
    slaves: [
      {
        // Servidor de lectura
        host: DB_HOST_READING,
        port: parsedPort,
        username: DB_USERNAME,
        password: DB_PASSWORD || '',
        database: DB_NAME,
      },
    ],
  },
  entities: EXPORTED_MODELS,
  logging: CONFIG.NODE_ENV === SERVER_ENVIRONMENTS.PRODUCTION ? false : true,
});

// Función de inicialización
export const initDB = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info(SERVER_MESSAGES.SUCCESS_DB_CONNECTED);
    }
  } catch (error) {
    logger.fatal({ err: error }, ERROR_DB_CONNECTION_FAILED);
    process.exit(1);
  }
};
```

### Uso en el proyecto

```typescript
// index.ts
import { initDB } from '@config/connection.js';

async function main() {
  await initDB(); // Inicializar base de datos
  // ...resto de la aplicación
}

// En services
import { AppDataSource } from '@config/connection.js';

class StudentService extends BaseService<Student> {
  constructor() {
    if (!AppDataSource?.isInitialized) {
      throw new Error('DataSource not initialized');
    }
    super(AppDataSource.getRepository(Student));
  }
}
```

---

## 📝 logger.ts - Pino Logger

Configura el sistema de logging con pino para desarrollo y producción.

### Para qué sirve

- ✅ **Logging estructurado**: JSON logs en producción, pretty print en desarrollo
- ✅ **HTTP logging**: Automático para todas las requests con pinoHttp
- ✅ **Niveles de log**: debug, info, warn, error, fatal
- ✅ **Performance**: Pino es uno de los loggers más rápidos
- ✅ **Contexto rico**: Incluye método, URL, params, query, user

### Cómo se hace

```typescript
// config/logger.ts
import pino from 'pino';
import { pinoHttp } from 'pino-http';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Logger principal de la aplicación
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
        ignore: 'pid,hostname',
        singleLine: true,
        colorize: true,
      },
    },
    base: null,
  }),
});

// Logger HTTP para Express middleware
export const httpLogger = pinoHttp({
  logger,
  quietReqLogger: true,
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customErrorMessage: function (_req, _res, error) {
    return `Request error, ${error.message}`;
  },
  customSuccessMessage: function (_req, res, _err) {
    return `Request completed with status code: ${res.statusCode}`;
  },
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        user: (req as any).user || null,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
});
```

### Uso en app.ts

```typescript
// app.ts
import express from 'express';
import { httpLogger } from '@config/logger.js';
import morgan from 'morgan';

const app = express();

// Aplicar logger HTTP middleware
app.use(httpLogger);
app.use(morgan('dev'));

export default app;
```

### Uso en Services/Controllers

```typescript
// En cualquier archivo
import { logger } from '@config/logger.js';

// Niveles de log
logger.debug('Debug information');
logger.info('Information message');
logger.warn('Warning message');
logger.error({ err: error }, 'Error occurred');
logger.fatal('Critical error, exiting...');

// Con contexto adicional
logger.info({ userId: 123, action: 'login' }, 'User logged in');

// Con objetos de error
try {
  // código
} catch (error) {
  logger.error({ err: error }, 'Failed to process request');
}
```

### Ejemplo en initDB

```typescript
// config/connection.ts
import { logger } from '@config/logger.js';

export const initDB = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      logger.info(SERVER_MESSAGES.SUCCESS_DB_CONNECTED);
    }
  } catch (error) {
    logger.fatal({ err: error }, ERROR_DB_CONNECTION_FAILED);
    process.exit(1);
  }
};
```

### Niveles de Log

| Nivel | Cuándo usar                                    | Ejemplo                                   |
| ----- | ---------------------------------------------- | ----------------------------------------- |
| debug | Información de desarrollo detallada            | Variables, estados internos               |
| info  | Operaciones normales                           | Servidor iniciado, request completado     |
| warn  | Situaciones inusuales pero no críticas         | Uso de valores por defecto, deprecaciones |
| error | Errores recuperables                           | Validación fallida, recurso no encontrado |
| fatal | Errores críticos que requieren terminar la app | DB connection failed, config missing      |

---

## 📦 Registrar Entidades

Las entidades se registran centralmente en `constants/common/models.ts`:

```typescript
// constants/common/models.ts
import { Product } from '@/api/products/productModel.js';
import { Student } from '@/api/students/studentModel.js';

// Exportar todas las entidades para TypeORM
export const EXPORTED_MODELS = [
  Product,
  Student,
  // Agregar más entidades aquí
] as const;

// Nombres de modelos para usar en controllers
export const MODELS_NAMES = {
  PRODUCT: 'Product',
  STUDENT: 'Student',
  // Agregar más nombres aquí
} as const;
```

**Importante**: Cada vez que creas una nueva entidad, debes:

1. Agregarla a `EXPORTED_MODELS`
2. Agregar su nombre a `MODELS_NAMES`

---

## 🔄 Flujo de Inicialización

```typescript
// index.ts
import 'dotenv/config';
import { verifyPortAvailable } from '@utils/verifyPort.js';
import app from '@/app.js';
import { CONFIG } from '@config/index.js';
import { SERVER_MESSAGES } from '@constants/common/server.js';
import { ERROR, ERROR_SERVER } from '@errors/server.js';
import { initDB } from '@config/connection.js';
import { setupRoutes } from '@utils/setupRoutes.js';
import { globalErrorHandler } from '@middleware/errorHandler.js';
import { logger } from '@config/logger.js';

async function main(): Promise<void> {
  const port: number = Number(CONFIG.PORT);

  // 1. Verificar puerto disponible
  await verifyPortAvailable(port);

  // 2. Inicializar base de datos
  await initDB();

  // 3. Configurar rutas automáticamente
  await setupRoutes(app);

  // 4. Aplicar middleware de error global
  app.use(globalErrorHandler);

  // 5. Iniciar servidor
  const server = app.listen(port);

  server.once(SERVER_MESSAGES.LISTENING, () => {
    logger.info(SERVER_MESSAGES.STARTING(port));
  });

  server.once(ERROR, (err: string) => {
    logger.fatal(ERROR_SERVER(err));
    process.exit(1);
  });
}

void main();
```

---

## ⚙️ Variables de Entorno Requeridas

Crear archivo `.env` en la raíz del proyecto:

```env
# Server
PORT=3000
NODE_ENV=development

# Database - MySQL Replication
DB_HOST_WRITING=localhost        # Master server
DB_HOST_READING=localhost        # Slave server
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=verticals_db

# JWT (opcional)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# CORS (opcional)
CORS_ORIGIN=http://localhost:3000

# Logging (opcional)
LOG_LEVEL=debug
```

---

## ✅ Mejores Prácticas

### ❌ NO hacer esto

```typescript
// ❌ NO - Usar process.env directamente
const port = process.env.PORT;
const dbHost = process.env.DB_HOST;

// ❌ NO - Conexión sin replicación
const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  // ...sin master/slave
});

// ❌ NO - Console.log
console.log('Server started');
console.error('Error:', error);

// ❌ NO - Hardcodear entidades
entities: [Product, Student, User],
```

### ✅ SÍ hacer esto

```typescript
// ✅ SÍ - Usar CONFIG centralizado
import { CONFIG } from '@config/index.js';
const port = CONFIG.PORT;
const dbHost = CONFIG.DB_HOST_WRITING;

// ✅ SÍ - Conexión con replicación
const dataSource = new DataSource({
  type: 'mysql',
  replication: {
    master: { host: CONFIG.DB_HOST_WRITING, ... },
    slaves: [{ host: CONFIG.DB_HOST_READING, ... }],
  },
  entities: EXPORTED_MODELS,
});

// ✅ SÍ - Usar logger
import { logger } from '@config/logger.js';
logger.info('Server started');
logger.error({ err: error }, 'Error occurred');

// ✅ SÍ - Entidades desde constant
import { EXPORTED_MODELS } from '@constants/common/models.js';
entities: EXPORTED_MODELS,
```

---

## 🔗 Referencias

- **TypeORM Replication**: https://typeorm.io/replication
- **Pino Logger**: https://github.com/pinojs/pino
- **Pino-HTTP**: https://github.com/pinojs/pino-http
- **dotenv**: https://github.com/motdotla/dotenv
- **MySQL Replication**: https://dev.mysql.com/doc/refman/8.0/en/replication.html

---

## 📝 Resumen

1. ✅ **index.ts**: Centraliza variables de entorno en `CONFIG`
2. ✅ **connection.ts**: TypeORM con replicación master-slave
3. ✅ **logger.ts**: Pino logger para app y HTTP
4. ✅ **Validar variables**: En tiempo de startup, no en runtime
5. ✅ **Usar logger**: No console.log/error
6. ✅ **Registrar entidades**: En `EXPORTED_MODELS`
7. ✅ **Type-safe**: Usar tipos de TypeScript
8. ✅ **initDB**: Siempre verificar `isInitialized`
