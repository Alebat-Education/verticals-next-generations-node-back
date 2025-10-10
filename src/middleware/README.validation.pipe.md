# ValidationPipe — Middleware de validación

Middleware que convierte el `req.body` en una instancia del DTO (clase) y ejecuta las reglas declaradas con `class-validator`. Devuelve errores estandarizados si la validación falla.

Qué hace:

- Convierte `req.body` a una instancia tipada del DTO con `plainToInstance`.
- Valida la instancia con `validate` de `class-validator`.
- Elimina propiedades no permitidas (`whitelist`) y puede rechazar cuerpos con campos extra (`forbidNonWhitelisted`).
- Reemplaza `req.body` con la instancia validada para que el controlador reciba datos tipados.

Opciones recomendadas:

- `whitelist: true` — elimina propiedades no incluidas en el DTO.
- `forbidNonWhitelisted: true` — lanza error si hay propiedades no permitidas.
- `skipMissingProperties: false` — requiere que los campos obligatorios estén presentes (usar `true` para updates parciales o `UpdateDto`).

Ejemplo de implementación:

```typescript
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

type ClassType<T> = { new (): T };

export function ValidationPipe<T>(dtoClass: ClassType<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Errores de validación',
        errors: errors.map(err => ({
          field: err.property,
          constraints: Object.values(err.constraints || {}),
        })),
      });
    }

    req.body = dtoObject as T;
    next();
  };
}
```

Buenas prácticas:

- Para endpoints de actualización parcial (`PATCH`/`PUT` con campos opcionales), usa `skipMissingProperties: true` o aplica `@IsOptional()` en el DTO de update.
- Mantén los mensajes de error en el idioma del proyecto (aquí: español) o usa un sistema i18n.
- Evita exponer detalles internos en producción; transforma constraints si es necesario.
