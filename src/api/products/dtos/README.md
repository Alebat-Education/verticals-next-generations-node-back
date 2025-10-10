# Sistema de DTOs y Validación Escalable

## 📖 Tabla de Contenidos

- [Introducción](#introducción)
- [Estructura de Archivos](#estructura-de-archivos)
- [ValidationPipe Mejorado](#validationpipe-mejorado)
- [Tipos de DTOs](#tipos-de-dtos)
- [Uso en Rutas](#uso-en-rutas)
- [Ejemplos Prácticos](#ejemplos-prácticos)
- [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Introducción

Este proyecto implementa un sistema de validación escalable usando:

- **class-validator**: Decoradores para validar propiedades
- **class-transformer**: Transformar objetos planos a instancias de clases
- **DTOs (Data Transfer Objects)**: Definir contratos de entrada/salida
- **ValidationPipe**: Middleware flexible para validar body, query y params

---

## 📁 Estructura de Archivos

```
src/
├── api/
│   └── products/
│       ├── productModel.ts          # Entity TypeORM
│       ├── productController.ts     # Controlador
│       ├── ProductService.ts        # Lógica de negocio
│       ├── ProductRoutes.ts         # Rutas con validación
│       └── dtos/
│           ├── CreateProductDto.ts  # DTO para POST
│           ├── UpdateProductDto.ts  # DTO para PUT/PATCH
│           ├── QueryProductDto.ts   # DTO para query params
│           └── ParamProductDto.ts   # DTO para route params
└── middleware/
    └── validation-pipe.ts           # Middleware de validación
```

---

## ⚙️ ValidationPipe Mejorado

### Características

✅ **Valida 3 tipos de datos**:

- `body` - Cuerpo de la petición (POST, PUT, PATCH)
- `query` - Query parameters (GET con filtros)
- `params` - Route parameters (/:id)

✅ **Auto-transformación de tipos**:

- Convierte strings a números automáticamente para query/params
- Usa decoradores `@Transform()` para conversiones personalizadas

✅ **Formato de errores consistente**:

```json
{
  "success": false,
  "message": "Errores de validación en el cuerpo de la petición",
  "errors": [
    {
      "field": "title",
      "constraints": ["El título es obligatorio", "El título debe tener entre 1 y 255 caracteres"]
    }
  ],
  "statusCode": 400
}
```

### Funciones Disponibles

```typescript
// Función principal (flexible)
ValidationPipe(DtoClass, 'body' | 'query' | 'params', options?)

// Aliases (más legibles)
ValidateBody(DtoClass, options?)
ValidateQuery(DtoClass, options?)
ValidateParams(DtoClass, options?)
```

### Opciones

```typescript
interface ValidationPipeOptions {
  whitelist?: boolean; // Eliminar propiedades no definidas en DTO
  forbidNonWhitelisted?: boolean; // Error si hay propiedades extra
  skipMissingProperties?: boolean; // Permitir campos opcionales sin validar
  enableImplicitConversion?: boolean; // Auto-transformar tipos (default: true para query/params)
  groups?: string[]; // Grupos de validación
}
```

---

## 📦 Tipos de DTOs

### 1. CreateProductDto (POST)

**Ubicación**: `src/api/products/dtos/CreateProductDto.ts`

**Propósito**: Validar datos al crear un producto

**Campos obligatorios**:

- `documentId` (string)
- `title` (string)
- `SKU` (string)
- `vertical` (array de Verticals)
- `type` (ProductType enum)
- `stripeCrm` (StripeCrm enum)

**Ejemplo**:

```typescript
import { IsString, IsNotEmpty, IsEnum, IsArray, Length } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'El título debe ser un texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @Length(1, 255, { message: 'El título debe tener entre 1 y 255 caracteres' })
  title!: string;

  @IsArray({ message: 'El vertical debe ser un array' })
  @ArrayMinSize(1, { message: 'Debe seleccionar al menos un vertical' })
  @IsEnum(Verticals, { each: true, message: 'Cada vertical debe ser un valor válido' })
  vertical!: Verticals[];
}
```

### 2. UpdateProductDto (PUT/PATCH)

**Ubicación**: `src/api/products/dtos/UpdateProductDto.ts`

**Propósito**: Validar datos al actualizar un producto

**Características**:

- Todos los campos son opcionales (`@IsOptional()`)
- Mismas validaciones que CreateProductDto pero sin `@IsNotEmpty()`

**Uso en rutas**:

```typescript
router.put('/:id', ValidateBody(UpdateProductDto, { skipMissingProperties: true }), controller.update);
```

### 3. QueryProductDto (GET con filtros)

**Ubicación**: `src/api/products/dtos/QueryProductDto.ts`

**Propósito**: Validar query parameters en endpoints de consulta

**Ejemplo**:

```typescript
export class QueryProductDto {
  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}
```

**Uso**:

```bash
GET /api/products?type=Libro&page=1&limit=10
```

### 4. ParamProductDto (Route params)

**Ubicación**: `src/api/products/dtos/ParamProductDto.ts`

**Propósito**: Validar parámetros de ruta (/:id)

**Ejemplo**:

```typescript
export class ParamProductDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'El ID debe ser un número entero' })
  @Min(1, { message: 'El ID debe ser un número positivo' })
  @IsNotEmpty({ message: 'El ID es obligatorio' })
  id!: number;
}
```

---

## 🛣️ Uso en Rutas

### Ejemplo Completo

```typescript
// ProductRoutes.ts
import { Router } from 'express';
import { ValidateBody, ValidateQuery, ValidateParams } from '@middleware/validation-pipe.js';
import { CreateProductDto } from './dtos/CreateProductDto.js';
import { UpdateProductDto } from './dtos/UpdateProductDto.js';
import { QueryProductDto } from './dtos/QueryProductDto.js';
import { ParamProductDto } from './dtos/ParamProductDto.js';

const router = Router();

// GET /api/products?type=Libro&page=1&limit=10
router.get('/', ValidateQuery(QueryProductDto), controller.findAll);

// GET /api/products/:id
router.get('/:id', ValidateParams(ParamProductDto), controller.findOne);

// POST /api/products
router.post('/', ValidateBody(CreateProductDto), controller.create);

// PUT /api/products/:id
router.put(
  '/:id',
  ValidateParams(ParamProductDto),
  ValidateBody(UpdateProductDto, { skipMissingProperties: true }),
  controller.update,
);

// DELETE /api/products/:id
router.delete('/:id', ValidateParams(ParamProductDto), controller.delete);

export default router;
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: POST /api/products (Crear producto)

**Request**:

```bash
POST /api/products
Content-Type: application/json

{
  "documentId": "DOC123",
  "title": "Máster en Cirugía",
  "SKU": "MAH-001",
  "vertical": ["Cirugía"],
  "type": "Programa largo",
  "stripeCrm": "Alebat"
}
```

**Validación aplicada**: `CreateProductDto`

**Si falta un campo**:

```json
{
  "success": false,
  "message": "Errores de validación en el cuerpo de la petición",
  "errors": [
    {
      "field": "title",
      "constraints": ["El título es obligatorio"]
    }
  ],
  "statusCode": 400
}
```

### Ejemplo 2: GET /api/products?type=Libro&page=2&limit=20

**Request**:

```bash
GET /api/products?type=Libro&page=2&limit=20
```

**Validación aplicada**: `QueryProductDto`

**Transformación automática**:

- `page` se convierte de string `"2"` a número `2`
- `limit` se convierte de string `"20"` a número `20`

**Si page es inválido**:

```bash
GET /api/products?page=abc
```

**Response**:

```json
{
  "success": false,
  "message": "Errores de validación en los parámetros de consulta",
  "errors": [
    {
      "field": "page",
      "constraints": ["La página debe ser un número entero"]
    }
  ],
  "statusCode": 400
}
```

### Ejemplo 3: PUT /api/products/:id (Actualizar producto)

**Request**:

```bash
PUT /api/products/5
Content-Type: application/json

{
  "title": "Nuevo título",
  "isPremium": true
}
```

**Validación aplicada**:

1. `ParamProductDto` valida que `id=5` es un número válido
2. `UpdateProductDto` valida que los campos enviados son correctos
3. Los campos no enviados se ignoran (`skipMissingProperties: true`)

---

## ✅ Mejores Prácticas

### 1. Separar DTOs por operación

```
✅ CORRECTO
├── CreateProductDto.ts  # POST - campos obligatorios
├── UpdateProductDto.ts  # PUT/PATCH - campos opcionales
├── QueryProductDto.ts   # GET - filtros y paginación
└── ParamProductDto.ts   # /:id - validación de params

❌ INCORRECTO
└── ProductDto.ts  # Un solo DTO para todo
```

### 2. Usar decoradores con mensajes en español

```typescript
✅ CORRECTO
@IsString({ message: 'El título debe ser un texto' })
@IsNotEmpty({ message: 'El título es obligatorio' })
title!: string;

❌ INCORRECTO
@IsString()  // Sin mensaje personalizado
title!: string;
```

### 3. Validar enums correctamente

```typescript
✅ CORRECTO
@IsEnum(ProductType, { message: 'El tipo de producto debe ser un valor válido' })
type!: ProductType;

❌ INCORRECTO
@IsString()  // Permite cualquier string
type!: string;
```

### 4. Transformar tipos en query/params

```typescript
✅ CORRECTO
@Transform(({ value }) => parseInt(value, 10))
@IsInt()
@Min(1)
page?: number;

❌ INCORRECTO
@IsInt()  // No transforma, siempre será string
page?: number;
```

### 5. Aplicar múltiples validaciones en rutas

```typescript
✅ CORRECTO - Validar params Y body
router.put(
  '/:id',
  ValidateParams(ParamProductDto),
  ValidateBody(UpdateProductDto),
  controller.update
);

❌ INCORRECTO - Solo validar body
router.put('/:id', ValidateBody(UpdateProductDto), controller.update);
```

### 6. Usar opciones apropiadas para cada caso

```typescript
// POST - Estricto, todos los campos requeridos
ValidateBody(CreateProductDto);

// PUT/PATCH - Permitir campos opcionales
ValidateBody(UpdateProductDto, { skipMissingProperties: true });

// Query - Auto-transformar tipos
ValidateQuery(QueryProductDto); // enableImplicitConversion: true por defecto
```

### 7. Documentar rutas con comentarios

```typescript
/**
 * @route   POST /api/products
 * @desc    Crear un nuevo producto
 * @access  Private
 * @body    CreateProductDto
 */
router.post('/', ValidateBody(CreateProductDto), controller.create);
```

---

## 🚀 Cómo Crear DTOs desde un Model

### Paso 1: Analizar el Model (Entity)

```typescript
// productModel.ts
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number; // ❌ No incluir en CreateDto (auto-generado)

  @Column({ nullable: false })
  title!: string; // ✅ Obligatorio en CreateDto

  @Column({ nullable: true })
  slug?: string; // ✅ Opcional en CreateDto

  @Column({ type: 'enum', enum: ProductType })
  type!: ProductType; // ✅ Validar con @IsEnum

  @CreateDateColumn()
  createdAt!: Date; // ❌ No incluir en CreateDto (auto-generado)
}
```

### Paso 2: Crear CreateDto

```typescript
// dtos/CreateProductDto.ts
export class CreateProductDto {
  // Campos obligatorios (nullable: false)
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsEnum(ProductType)
  @IsNotEmpty()
  type!: ProductType;

  // Campos opcionales (nullable: true)
  @IsString()
  @IsOptional()
  slug?: string;

  // ❌ NO incluir:
  // - id (auto-generado)
  // - createdAt, updatedAt (timestamps automáticos)
}
```

### Paso 3: Crear UpdateDto (copiar CreateDto pero todo opcional)

```typescript
// dtos/UpdateProductDto.ts
export class UpdateProductDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @IsString()
  @IsOptional()
  slug?: string;
}
```

### Paso 4: Crear QueryDto (para filtros)

```typescript
// dtos/QueryProductDto.ts
export class QueryProductDto {
  // Filtros
  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @IsString()
  @IsOptional()
  slug?: string;

  // Paginación
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}
```

### Paso 5: Crear ParamDto (para /:id)

```typescript
// dtos/ParamProductDto.ts
export class ParamProductDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  id!: number;
}
```

---

## 🎓 Resumen

| DTO           | Uso          | Campos                              | Validación                       |
| ------------- | ------------ | ----------------------------------- | -------------------------------- |
| **CreateDto** | POST         | Obligatorios + opcionales del model | Estricta                         |
| **UpdateDto** | PUT/PATCH    | Todos opcionales                    | `skipMissingProperties: true`    |
| **QueryDto**  | GET          | Filtros + paginación                | `enableImplicitConversion: true` |
| **ParamDto**  | /:id, /:slug | Parámetros de ruta                  | Transformar a tipo correcto      |

---

## 📚 Recursos

- [class-validator](https://github.com/typestack/class-validator)
- [class-transformer](https://github.com/typestack/class-transformer)
- [TypeORM](https://typeorm.io/)
- [Express.js](https://expressjs.com/)

---

**✅ Sistema implementado y listo para usar**

Ahora puedes crear DTOs escalables para cualquier módulo siguiendo este patrón.
