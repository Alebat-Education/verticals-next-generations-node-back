# Middleware

Funciones que se ejecutan entre el request y response para validar, autenticar o procesar datos.

## Para qué sirve

- Validar tokens de autenticación
- Verificar permisos
- Validar datos de entrada
- Logging de requests

## Cómo se hace

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: number;
}

// Middleware para validar token JWT
export const validateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.userId = decoded.id;

    next(); // Continúa al siguiente middleware/controlador
  } catch (error) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// Middleware para validar datos
export const validateData = (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ msg: 'Name and email are required' });
  }

  next();
};
```

## Uso en rutas

```typescript
import { validateToken, validateData } from './middleware/authMiddleware';

// Aplicar middleware a rutas específicas
router.get('/protected', validateToken, controller.getProtectedData);
router.post('/users', validateData, controller.createUser);

// Aplicar middleware global
app.use('/api', validateToken);
```
