# 🌐 Middleware de Validación de Idioma (Language Validator)

## 📋 Descripción

Middleware que valida el header `accept-language` de las peticiones HTTP para asegurar que el idioma solicitado esté soportado por la API. Utiliza el sistema centralizado de errores para un manejo consistente.

## ✅ Características

- ✅ **Validación de idiomas soportados**: Verifica contra una lista de idiomas permitidos
- ✅ **Sistema de errores centralizado**: Usa `ValidationError` del sistema de errores
- ✅ **Type-safe**: Tipos TypeScript estrictos con constantes inmutables
- ✅ **Sin Magic Strings**: Usa constantes para idiomas y mensajes
- ✅ **Manejo automático de errores**: Se integra con `globalErrorHandler`

## 🔧 Uso

### Importación

```typescript
import { validateLangPipe } from '@middleware/validateLang.pipe.js';
```

### Aplicación en Rutas

```typescript
// Aplicar a todas las rutas de un router
router.use(validateLangPipe);

// Aplicar a rutas específicas
router.get('/products', validateLangPipe, ProductController.getAll);
router.post('/products', validateLangPipe, ValidateBody(CreateProductDto), ProductController.create);

// Aplicar globalmente en app.ts
app.use(validateLangPipe);
```

## 📝 Implementación

```typescript
import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@utils/errors.js';

const SUPPORTED_LANGUAGES = ['es', 'en', 'fr'] as const;

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_ERROR_MESSAGE = 'Language not supported. Supported languages are: es, en, fr';

export function validateLangPipe(req: Request, _res: Response, next: NextFunction): void {
  const lang = req.headers['accept-language'];

  if (!lang || !SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
    throw new ValidationError(LANGUAGE_ERROR_MESSAGE);
  }

  next();
}
```

## 🎯 Flujo de Validación

```
Request con header 'accept-language'
    ↓
validateLangPipe verifica el idioma
    ↓
├─ ¿Idioma soportado (es, en, fr)?
│   ├─ SÍ → next() continúa al siguiente middleware/controlador
│   └─ NO → throw new ValidationError('Language not supported...')
    ↓
globalErrorHandler captura el error
    ↓
Response 400 Bad Request con formato estándar
```

## 📤 Respuestas

### ✅ Idioma Válido

```http
GET /api/products
accept-language: es

HTTP/1.1 200 OK
{
  "data": [...]
}
```

### ❌ Idioma No Soportado

```http
GET /api/products
accept-language: de

HTTP/1.1 400 Bad Request
{
  "statusCode": 400,
  "message": "Validation error",
  "details": "Language not supported. Supported languages are: es, en, fr",
  "timestamp": "2025-10-10T12:34:56.789Z",
  "path": "/api/products"
}
```

### ❌ Header Faltante

```http
GET /api/products
(sin header accept-language)

HTTP/1.1 400 Bad Request
{
  "statusCode": 400,
  "message": "Validation error",
  "details": "Language not supported. Supported languages are: es, en, fr",
  "timestamp": "2025-10-10T12:34:56.789Z",
  "path": "/api/products"
}
```

## 🔧 Personalización

### Agregar Más Idiomas

```typescript
const SUPPORTED_LANGUAGES = ['es', 'en', 'fr', 'de', 'pt'] as const;
```

### Mover Constantes a Archivo Central

```typescript
// src/constants/validation/languages.ts
export const SUPPORTED_LANGUAGES = ['es', 'en', 'fr'] as const;
export const LANGUAGE_ERROR_MESSAGE = 'Language not supported. Supported languages are: es, en, fr';

// src/middleware/validateLang.pipe.ts
import { SUPPORTED_LANGUAGES, LANGUAGE_ERROR_MESSAGE } from '@constants/validation/languages.js';
```

### Header Personalizado

```typescript
// Usar header personalizado en lugar de accept-language
const lang = req.headers['x-app-language'];
```

## 🎨 Mejores Prácticas Aplicadas

### ✅ Sistema de Errores Centralizado

```typescript
// ❌ ANTES: Respuesta manual en el middleware
return res.status(400).json({ message: 'language not supported' });

// ✅ DESPUÉS: Usa ValidationError del sistema centralizado
throw new ValidationError(LANGUAGE_ERROR_MESSAGE);
```

### ✅ Sin Magic Strings

```typescript
// ❌ ANTES: Array literal inline
if (!['es', 'en', 'fr'].includes(lang)) { ... }

// ✅ DESPUÉS: Constante tipada
const SUPPORTED_LANGUAGES = ['es', 'en', 'fr'] as const;
if (!SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) { ... }
```

### ✅ Type Safety

```typescript
// Define tipo basado en constante
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
// Resultado: 'es' | 'en' | 'fr'
```

### ✅ Parámetros No Usados

```typescript
// ❌ ANTES
export function validateLangPipe(req: Request, res: Response, next: NextFunction);

// ✅ DESPUÉS: Prefijo _ para parámetros no usados
export function validateLangPipe(req: Request, _res: Response, next: NextFunction);
```

## 🔗 Integración con Sistema de Errores

Este middleware se integra perfectamente con:

- **`ValidationError`**: Clase de error para validaciones (400)
- **`globalErrorHandler`**: Middleware que captura y formatea errores
- **`httpLogger`**: Logger de Pino que registra la petición y error

## 📊 Ejemplo de Log

```json
{
  "level": "warn",
  "time": 1728561296789,
  "msg": "Request error, Validation error",
  "err": {
    "type": "ValidationError",
    "message": "Validation error",
    "statusCode": 400,
    "details": "Language not supported. Supported languages are: es, en, fr"
  },
  "method": "GET",
  "url": "/api/products",
  "query": {},
  "params": {}
}
```

## 🚀 Ventajas del Nuevo Sistema

1. **🎯 Consistencia**: Todas las validaciones usan el mismo formato de error
2. **🔍 Debugging Mejorado**: Logs estructurados con contexto completo
3. **📊 Monitoring**: Errores operacionales clasificados apropiadamente
4. **🧹 Clean Code**: Sin duplicación de lógica de respuesta
5. **🔒 Type Safety**: TypeScript previene errores en tiempo de compilación
6. **📝 Mantenibilidad**: Cambios en formato de error se hacen en un solo lugar
