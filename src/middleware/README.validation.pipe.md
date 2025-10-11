# 🔍 ValidationPipe — Middleware de Validación Avanzado

## 📋 Descripción

Middleware robusto que transforma y valida datos de peticiones HTTP (body, query, params) usando **class-validator** y **class-transformer**. Se integra con el sistema centralizado de errores para un manejo consistente y profesional.

## ✅ Características Principales

- ✅ **Validación de múltiples fuentes**: body, query parameters, route params
- ✅ **Transformación automática**: Convierte plain objects a instancias de clase tipadas
- ✅ **Whitelist automático**: Elimina propiedades no permitidas en el DTO
- ✅ **Errores detallados**: Formato estructurado con field-level errors
- ✅ **Sistema de errores centralizado**: Usa `ValidationError` e `InternalServerError`
- ✅ **Type-safe**: Reemplaza `req[type]` con instancia validada y tipada
- ✅ **Conversión implícita**: Convierte tipos en query/params automáticamente
- ✅ **Sin Magic Numbers**: Usa constantes del sistema de errores
- ✅ **Manejo robusto**: Captura errores de validación y errores internos

## 🎯 ¿Qué hace el ValidationPipe?

1. **Transforma** `req[type]` (body/query/params) a una instancia del DTO con `plainToInstance`
2. **Valida** la instancia con decoradores de `class-validator`
3. **Elimina** propiedades no permitidas (`whitelist: true`)
4. **Rechaza** peticiones con campos extra (`forbidNonWhitelisted: true`)
5. **Reemplaza** `req[type]` con la instancia validada para acceso tipado en controladores
6. **Delega** manejo de errores al `globalErrorHandler`

## 🔧 Uso

### Importación

```typescript
import { ValidationPipe, ValidateBody, ValidateQuery, ValidateParams } from '@middleware/validation-pipe.js';
```

### Validación de Body

```typescript
import { ValidateBody } from '@middleware/validation-pipe.js';
import { CreateProductDto } from '@api/products/dtos/CreateProductDto.js';

// En rutas
router.post('/products', ValidateBody(CreateProductDto), ProductController.create);

// En controlador - body ya está tipado
async create(req: Request, res: Response, next: NextFunction) {
  // req.body es instancia de CreateProductDto validada
  const product = await ProductService.create(req.body);
  res.status(HTTP_STATUS.CREATED).json(product);
}
```

### Validación de Query Parameters

```typescript
import { ValidateQuery } from '@middleware/validation-pipe.js';
import { QueryProductDto } from '@api/products/dtos/QueryProductDto.js';

// Conversión automática de strings a números/booleanos
router.get('/products', ValidateQuery(QueryProductDto), ProductController.getAll);

// QueryProductDto.ts
export class QueryProductDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number; // "10" → 10

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
```

### Validación de Route Parameters

```typescript
import { ValidateParams } from '@middleware/validation-pipe.js';
import { ParamProductDto } from '@api/products/dtos/ParamProductDto.js';

router.get('/products/:id', ValidateParams(ParamProductDto), ProductController.getById);

// ParamProductDto.ts
export class ParamProductDto {
  @IsUUID()
  id: string;
}
```

### Uso Avanzado con Opciones

```typescript
// Updates parciales - permite campos opcionales
router.patch(
  '/products/:id',
  ValidateBody(UpdateProductDto, { skipMissingProperties: true }),
  ProductController.update,
);

// Validación por grupos
router.post('/products/draft', ValidateBody(ProductDto, { groups: ['draft'] }), ProductController.createDraft);

// Permitir propiedades extra (no recomendado)
router.post('/products/flexible', ValidateBody(ProductDto, { forbidNonWhitelisted: false }), ProductController.create);
```

## 📝 Implementación Actual

```typescript
import { plainToInstance } from 'class-transformer';
import { validate, type ValidationError as ClassValidatorError } from 'class-validator';
import type { Request, Response, NextFunction } from 'express';
import { VALIDATION_ERROR_MESSAGES } from '@constants/validation/index.js';
import { ValidationError, InternalServerError } from '@utils/errors.js';

export function ValidationPipe<T extends object>(
  dtoClass: ClassType<T>,
  type: ValidationType = 'body',
  options?: ValidationPipeOptions,
) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const dtoObject = plainToInstance(dtoClass, req[type], {
        enableImplicitConversion: type === 'query' || type === 'params',
        excludeExtraneousValues: false,
      });

      const errors = await validate(dtoObject, {
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
        ...options,
      });

      if (errors.length > 0) {
        const formattedErrors = formatValidationErrors(errors);
        throw new ValidationError(JSON.stringify(formattedErrors));
      }

      req[type] = dtoObject as unknown;
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        next(error);
      } else {
        next(new InternalServerError(VALIDATION_ERROR_MESSAGES.INTERNAL_VALIDATION_ERROR));
      }
    }
  };
}
```

## 🎯 Flujo de Validación

```
Request con body/query/params
    ↓
ValidationPipe transforma a instancia DTO
    ↓
Valida con decoradores class-validator
    ↓
├─ ¿Errores de validación?
│   ├─ SÍ → throw new ValidationError(detalles)
│   └─ NO → req[type] = dtoObject tipado
    ↓
├─ Error interno?
│   └─ SÍ → throw new InternalServerError()
    ↓
globalErrorHandler captura el error
    ↓
Response con formato estándar
```

## 📤 Respuestas de Ejemplo

### ✅ Validación Exitosa

```http
POST /api/products
Content-Type: application/json

{
  "title": "Product Name",
  "price": 29.99
}

HTTP/1.1 201 Created
{
  "id": "123",
  "title": "Product Name",
  "price": 29.99
}
```

### ❌ Errores de Validación

```http
POST /api/products
Content-Type: application/json

{
  "title": "",
  "price": -10,
  "extraField": "not allowed"
}

HTTP/1.1 400 Bad Request
{
  "statusCode": 400,
  "message": "Validation error",
  "details": "[{\"field\":\"title\",\"constraints\":[\"title must be between 1 and 255 characters\"]},{\"field\":\"price\",\"constraints\":[\"price must be a positive number\"]},{\"field\":\"extraField\",\"constraints\":[\"property extraField should not exist\"]}]",
  "timestamp": "2025-10-10T12:34:56.789Z",
  "path": "/api/products"
}
```

## ⚙️ Opciones de Configuración

### `ValidationPipeOptions`

```typescript
interface ValidationPipeOptions {
  whitelist?: boolean; // Elimina propiedades no decoradas (default: true)
  forbidNonWhitelisted?: boolean; // Rechaza propiedades extra (default: true)
  skipMissingProperties?: boolean; // Permite campos opcionales (default: false)
  enableImplicitConversion?: boolean; // Convierte tipos automáticamente (default: auto para query/params)
  groups?: string[]; // Valida solo decoradores con grupos específicos
}
```

### Casos de Uso por Opción

| Opción                     | Create | Update Parcial | Query/Params |
| -------------------------- | ------ | -------------- | ------------ |
| `whitelist`                | ✅     | ✅             | ✅           |
| `forbidNonWhitelisted`     | ✅     | ✅             | ✅           |
| `skipMissingProperties`    | ❌     | ✅             | ✅           |
| `enableImplicitConversion` | ❌     | ❌             | ✅ (auto)    |

## 🎨 Mejores Prácticas Aplicadas

### ✅ Sistema de Errores Centralizado

```typescript
// ❌ ANTES: Respuesta manual en middleware
return res.status(400).json({
  success: false,
  message: 'Validation failed',
  errors: formattedErrors,
});

// ✅ DESPUÉS: Delega al globalErrorHandler
throw new ValidationError(JSON.stringify(formattedErrors));
// globalErrorHandler se encarga del formato de respuesta
```

### ✅ Manejo de Errores Robusto

```typescript
// Distingue entre errores de validación y errores internos
catch (error) {
  if (error instanceof ValidationError) {
    next(error); // Error operacional (400)
  } else {
    next(new InternalServerError(...)); // Error no operacional (500)
  }
}
```

### ✅ Type Safety Completo

```typescript
// ❌ ANTES: any types
req.body = dtoObject as any;

// ✅ DESPUÉS: unknown + type assertion
req[type] = dtoObject as unknown;
// Controlador recibe tipo correcto del DTO
```

### ✅ Sin Magic Numbers

```typescript
// ❌ ANTES: Status codes hardcodeados
res.status(400).json(...);
res.status(500).json(...);

// ✅ DESPUÉS: Usa constantes del sistema
throw new ValidationError(...); // Usa HTTP_STATUS.BAD_REQUEST internamente
throw new InternalServerError(...); // Usa HTTP_STATUS.INTERNAL_SERVER_ERROR
```

### ✅ Evita Conflictos de Nombres

```typescript
// Renombra ValidationError de class-validator
import { validate, type ValidationError as ClassValidatorError } from 'class-validator';
// Usa ValidationError del sistema de errores
import { ValidationError } from '@utils/errors.js';
```

## 📊 Formato de Errores Detallado

### Errores Anidados

```typescript
// DTO con nested objects
class AddressDto {
  @IsString()
  street: string;

  @IsInt()
  @Type(() => Number)
  number: number;
}

class CreateUserDto {
  @IsEmail()
  email: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

// Error response
{
  "statusCode": 400,
  "message": "Validation error",
  "details": "[
    {\"field\":\"email\",\"constraints\":[\"email must be a valid email\"]},
    {\"field\":\"address.street\",\"constraints\":[\"street must be a string\"]},
    {\"field\":\"address.number\",\"constraints\":[\"number must be an integer\"]}
  ]",
  "timestamp": "2025-10-10T12:34:56.789Z",
  "path": "/api/users"
}
```

## 🚀 Ventajas del Sistema

1. **🎯 Validación Consistente**: Mismo formato de error en toda la API
2. **🔍 Debugging Mejorado**: Logs estructurados con contexto completo
3. **📊 Type Safety**: Controladores reciben datos tipados y validados
4. **🛡️ Seguridad**: Whitelist previene mass assignment vulnerabilities
5. **🧹 Clean Code**: Lógica de validación centralizada, no duplicada
6. **📝 Mantenibilidad**: Cambios en DTOs automáticamente actualizan validaciones
7. **🔒 Robustez**: Distingue errores operacionales de crashes internos

## 🔗 Integración con el Ecosistema

- **DTOs**: Clases con decoradores de `class-validator`
- **ValidationError**: Error operacional (400) del sistema centralizado
- **globalErrorHandler**: Captura y formatea todos los errores
- **httpLogger**: Registra peticiones y errores con Pino
- **Constantes**: `VALIDATION_ERROR_MESSAGES` centralizadas

## 📚 Referencias

- [class-validator Documentation](https://github.com/typestack/class-validator)
- [class-transformer Documentation](https://github.com/typestack/class-transformer)
- Sistema de Errores: `src/utils/errors.ts`
- Global Error Handler: `src/middleware/errorHandler.ts`

Buenas prácticas:

- Para endpoints de actualización parcial (`PATCH`/`PUT` con campos opcionales), usa `skipMissingProperties: true` o aplica `@IsOptional()` en el DTO de update.
- Mantén los mensajes de error en el idioma del proyecto (aquí: español) o usa un sistema i18n.
- Evita exponer detalles internos en producción; transforma constraints si es necesario.
