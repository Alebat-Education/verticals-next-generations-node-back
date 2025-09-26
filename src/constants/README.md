# Constants

Valores que no cambian. En vez de escribir `200` o `'admin'` por todos lados, los defines una vez aquí.

## Regla simple

Si escribes el mismo número o string más de 2 veces → mételo en constants

## Para qué sirve

- **Evitar números mágicos**: `HTTP_STATUS.OK` es más claro que `200`
- **Cambios fáciles**: Cambias un valor y se actualiza en todo el proyecto
- **Sin errores de typo**: `ROLES.ADMIN` en vez de escribir `'admin'` mal

## Cómo se hace

```typescript
// constants/httpStatus.ts
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
} as const;
```

```typescript
// constants/roles.ts
export const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  PROFESSOR: 'professor',
} as const;
```

```typescript
// constants/validation.ts
export const VALIDATION_RULES = {
  MIN_AGE: 16,
  MAX_AGE: 65,
  MAX_NAME_LENGTH: 100,
} as const;
```

## Cómo usarlas

```typescript
import { HTTP_STATUS } from '../constants/httpStatus';
import { ROLES } from '../constants/roles';
import { VALIDATION_RULES } from '../constants/validation';

async create(req: Request, res: Response): Promise<void> {
  if (req.user.role !== ROLES.ADMIN) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'No permission' });
  }

  if (req.body.age < VALIDATION_RULES.MIN_AGE) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Too young' });
  }

  const student = await this.service.create(req.body);
  res.status(HTTP_STATUS.CREATED).json(student);
}
```
