# Verticals Next Generations - Backend API

Un backend moderno construido con Node.js, TypeScript, Express y TypeORM para el proyecto Verticals Next Generations.

## 🚀 Características

- **TypeScript**: Desarrollo con tipado estático
- **Express.js**: Framework web rápido y minimalista
- **TypeORM**: ORM moderno para TypeScript y JavaScript
- **MySQL**: Base de datos relacional
- **ES Modules**: Soporte completo para módulos ES6
- **Path Mapping**: Importaciones limpias con aliases (@)
- **Hot Reload**: Desarrollo con recarga automática usando tsx
- **Linting & Formatting**: ESLint + Prettier para código consistente
- **CORS**: Configuración para Cross-Origin Resource Sharing
- **Environment Variables**: Configuración flexible con dotenv

## 📋 Requisitos Previos

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recomendado) o npm/yarn
- **MySQL** >= 8.0

## 🛠️ Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/rodri542/verticals-next-generations-node-back.git
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

# Database
DB_HOST=localhost
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
├── app.ts                 # Configuración principal de Express
├── index.ts              # Punto de entrada de la aplicación
├── config/               # Configuraciones
│   └── index.ts          # Variables de entorno y configuración
├── constants/            # Constantes de la aplicación
├── controllers/          # Controladores HTTP
├── db/                   # Configuración de base de datos
├── interfaces/           # Interfaces TypeScript
├── middleware/           # Middlewares de Express
├── migrations/           # Migraciones de base de datos
├── models/               # Modelos/Entidades de TypeORM
├── routes/               # Definición de rutas
├── services/             # Lógica de negocio
├── types/                # Tipos TypeScript
└── utils/                # Utilidades y helpers
```

## 🔧 Path Mapping (Aliases)

El proyecto usa aliases para importaciones más limpias:

```typescript
// En lugar de importaciones relativas
import { CONFIG } from '../../../config';
import { UserService } from '../../services/UserService';

// Usa aliases
import { CONFIG } from '@config/index';
import { UserService } from '@services/UserService';
```

### Aliases disponibles:

- `@/*` - Carpeta src
- `@config/*` - Configuración
- `@constants/*` - Constantes
- `@controllers/*` - Controladores
- `@db/*` - Base de datos
- `@interfaces/*` - Interfaces
- `@middleware/*` - Middlewares
- `@migrations/*` - Migraciones
- `@models/*` - Modelos
- `@routes/*` - Rutas
- `@services/*` - Servicios
- `@types/*` - Tipos
- `@utils/*` - Utilidades

## 🗄️ Base de Datos

El proyecto usa TypeORM con MySQL. Configuración principal:

- **ORM**: TypeORM 0.3.27
- **Base de datos**: MySQL
- **Migraciones**: Automáticas durante desarrollo
- **Entidades**: Definidas en `src/models/`

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
