# Verticals Next Generations - Backend API

Un backend moderno construido con Node.js, TypeScript, Express y TypeORM para el proyecto Verticals Next Generations.

## 🚀 Características

- **TypeScript**: Desarrollo con tipado estático
- **Express.js**: Framework web rápido y minimalista
- **TypeORM**: ORM moderno con soporte para MySQL replication (master-slave)
- **MySQL**: Base de datos relacional con configuración de lectura/escritura
- **ES Modules**: Soporte completo para módulos ES6
- **Path Mapping**: Importaciones limpias con aliases (@config, @common, @constants, etc.)
- **Hot Reload**: Desarrollo con recarga automática usando tsx
- **Linting & Formatting**: ESLint + Prettier para código consistente
- **CORS**: Configuración para Cross-Origin Resource Sharing
- **Environment Variables**: Configuración flexible con dotenv
- **Arquitectura Base**: Controllers y Services abstractos reutilizables (BaseController, BaseService)
- **Logger**: Sistema de logging con pino para desarrollo y producción
- **Error Handling**: Manejo centralizado de errores con clases personalizadas
- **Auto Setup Routes**: Configuración automática de rutas desde los módulos

## 📋 Requisitos Previos

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recomendado) o npm/yarn
- **MySQL** >= 8.0

## 🛠️ Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/Alebat-Education/verticals-next-generations-node-back.git
   cd verticals-next-generations-node-back
   ```

2. **Instalar dependencias**

   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Configurar base de datos**
   - Crear base de datos MySQL
   - Actualizar credenciales en `.env`

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Server
PORT=3000
NODE_ENV=development

# Database - MySQL Replication Configuration
DB_HOST_WRITING=localhost_1    # Master server (write operations)
DB_HOST_READING=localhost_2    # Slave server (read operations)
DB_PORT=3306
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=verticals_db

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug
```

## 🏃‍♂️ Scripts Disponibles

```bash
# Desarrollo con hot reload
pnpm dev

# Compilar para producción
pnpm build

# Ejecutar versión compilada
pnpm start

# Linting
pnpm lint
pnpm lint:fix

# Formateo de código
pnpm format

# Tests (pendiente implementar)
pnpm test
```

## 📁 Estructura del Proyecto

```
src/
├── app.ts                     # Configuración principal de Express
├── index.ts                   # Punto de entrada de la aplicación
├── api/                       # Módulos de la API
│   ├── common/                # Base classes compartidas
│   │   ├── GlobalController.ts  # BaseController abstracto
│   │   └── GlobalService.ts     # BaseService abstracto
│   ├── example/               # Ejemplo de módulo (guía)
│   │   ├── README.controller.MD
│   │   ├── README.models.md
│   │   ├── README.routes.MD
│   │   ├── README.services.md
│   │   ├── README.test.md
│   │   └── dtos/
│   │       └── README.dto.md
│   └── products/              # Ejemplo de módulo implementado
│       ├── productController.ts
│       ├── productModel.ts
│       ├── ProductRoutes.ts
│       ├── ProductService.ts
│       └── dtos/
├── config/                    # Configuraciones
│   ├── connection.ts          # TypeORM DataSource con MySQL replication
│   ├── index.ts               # Variables de entorno
│   ├── logger.ts              # Configuración de pino logger
│   └── README.MD
├── constants/                 # Constantes de la aplicación
│   ├── common/
│   │   ├── http.ts            # Status codes y mensajes HTTP
│   │   ├── models.ts          # Nombres de modelos y entidades exportadas
│   │   └── server.ts          # Configuración del servidor
│   ├── errors/
│   │   ├── common.ts          # Errores comunes
│   │   ├── error-messages.ts  # Mensajes de error
│   │   ├── errors.ts          # Clases de error personalizadas
│   │   └── server.ts          # Errores del servidor
│   └── README.md
├── interfaces/                # Interfaces TypeScript
│   ├── http.ts                # Interfaces de respuestas HTTP
│   ├── Enums/
│   │   ├── global.ts
│   │   └── product.ts
│   └── README.md
├── middleware/                # Middlewares de Express
│   ├── errorHandler.ts        # Manejador global de errores
│   └── README.md
├── migrations/                # Migraciones de TypeORM
│   └── README.md
├── tests/                     # Tests generales (integración, e2e)
│   └── README.md
├── types/                     # Tipos TypeScript personalizados
│   └── README.md
└── utils/                     # Utilidades y helpers
    ├── isValidId.ts           # Validación de IDs
    ├── setupRoutes.ts         # Auto-configuración de rutas
    ├── verifyPort.ts          # Verificación de puerto disponible
    └── README.md
```

## 🔧 Path Mapping (Aliases)

El proyecto usa aliases para importaciones más limpias:

```typescript
// En lugar de importaciones relativas
import { CONFIG } from '../../../config';
import { BaseController } from '../../api/common/GlobalController';

// Usa aliases
import { CONFIG } from '@config/index.js';
import { BaseController } from '@common/GlobalController.js';
```

### Aliases disponibles:

- `@/*` - Carpeta src raíz
- `@common/*` - Classes base compartidas (BaseController, BaseService)
- `@config/*` - Configuración y conexión a DB
- `@constants/*` - Constantes de la aplicación
- `@errors/*` - Constantes de errores
- `@interfaces/*` - Interfaces TypeScript
- `@middleware/*` - Middlewares de Express
- `@migrations/*` - Migraciones de TypeORM
- `@types/*` - Tipos TypeScript personalizados
- `@utils/*` - Utilidades y helpers

**Nota**: Todos los imports deben incluir la extensión `.js` para compatibilidad con ES Modules.

## 🗄️ Base de Datos

El proyecto usa TypeORM con MySQL en configuración de replicación (master-slave):

- **ORM**: TypeORM 0.3.27
- **Base de datos**: MySQL con replication support
- **Master**: Servidor de escritura (`DB_HOST_WRITING`)
- **Slave**: Servidor de lectura (`DB_HOST_READING`)
- **Migraciones**: Controladas manualmente vía TypeORM CLI
- **Entidades**: Definidas dentro de cada módulo en `src/api/{module}/` y exportadas en `constants/common/models.ts`
- **Logging**: Deshabilitado en producción, habilitado en desarrollo

## 🏗️ Arquitectura del Proyecto

### Patrón Base: BaseController y BaseService

El proyecto implementa clases abstractas base para reutilizar lógica común:

#### BaseService (`src/api/common/GlobalService.ts`)

Proporciona métodos CRUD estándar para todas las entidades:

```typescript
import { BaseService } from '@common/GlobalService.js';
import { AppDataSource } from '@config/connection.js';
import { Product } from './productModel.js';

class ProductService extends BaseService<Product> {
  constructor() {
    super(AppDataSource.getRepository(Product));
  }

  // Métodos heredados automáticamente:
  // - findAll()
  // - findById()
  // - findBy()
  // - findOneBy()
  // - create()
  // - update()
  // - delete()
  // - exists()
  // - count()

  // Agrega tus métodos específicos aquí
  async findByCategory(category: string): Promise<Product[]> {
    return this.findBy({ category });
  }
}

export const productService = new ProductService();
```

#### BaseController (`src/api/common/GlobalController.ts`)

Proporciona endpoints HTTP estándar para todas las entidades:

```typescript
import { BaseController } from '@common/GlobalController.js';
import { productService } from './ProductService.js';
import { MODELS_NAMES } from '@constants/common/models.js';

export class ProductController extends BaseController<Product> {
  constructor() {
    super(productService, MODELS_NAMES.PRODUCT);
  }

  // Endpoints heredados automáticamente:
  // - GET /  (findAll)
  // - GET /:id  (findOne)
  // - POST /  (create)
  // - PUT /:id  (update)
  // - DELETE /:id  (delete)

  // Agrega tus endpoints específicos aquí
}

export const productController = new ProductController();
```

### Estructura de un Módulo

Cada módulo de la API sigue esta estructura:

```
api/products/
├── productModel.ts           # Entity de TypeORM
├── ProductService.ts         # Lógica de negocio (extiende BaseService)
├── productController.ts      # Controlador HTTP (extiende BaseController)
├── ProductRoutes.ts          # Definición de rutas
└── dtos/                     # Data Transfer Objects
    ├── CreateProductDto.ts
    └── UpdateProductDto.ts
```

### Auto-configuración de Rutas

Las rutas se configuran automáticamente usando el helper `setupRoutes`:

```typescript
// index.ts
import { setupRoutes } from '@utils/setupRoutes.js';
import app from './app.js';

await setupRoutes(app);
```

El sistema busca automáticamente archivos `*Routes.ts` en `src/api/` y los registra.

## 🔍 Linting y Formateo

### ESLint

- Configuración TypeScript estricta
- Reglas de consistencia de imports
- Soporte para path mapping

### Prettier

- Formateo automático de código
- Integración con ESLint
- Configuración para TypeScript, JSON y Markdown

## 🚀 Despliegue

### Desarrollo

```bash
pnpm dev
```

### Producción

```bash
# Compilar
pnpm build

# Ejecutar
pnpm start
```

## 📚 Stack Tecnológico

### Runtime & Language

- **Node.js** - Runtime de JavaScript
- **TypeScript** - Superset tipado de JavaScript

### Framework & Server

- **Express.js** - Framework web
- **tsx** - Ejecutor TypeScript con hot reload

### Base de Datos

- **MySQL2** - Driver de MySQL
- **TypeORM** - Object-Relational Mapping

### Desarrollo

- **ESLint** - Linter de código
- **Prettier** - Formateador de código
- **tsx** - Compilador y ejecutor TypeScript

### Utilidades

- **dotenv** - Variables de entorno
- **cors** - Cross-Origin Resource Sharing
- **morgan** - Logger de HTTP requests
- **reflect-metadata** - Metadata para decoradores
