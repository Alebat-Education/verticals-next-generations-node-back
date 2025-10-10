import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Request, Response, NextFunction } from 'express';

type ClassType<T extends object> = { new (): T };

export function ValidationPipe<T extends object>(dtoClass: ClassType<T>) {
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
