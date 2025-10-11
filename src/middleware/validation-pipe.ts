import { plainToInstance } from 'class-transformer';
import { validate, type ValidationError as ClassValidatorError } from 'class-validator';
import type { Request, Response, NextFunction } from 'express';
import { VALIDATION_ERROR_MESSAGES } from '@constants/validation/index.js';
import { ValidationError, InternalServerError } from '@utils/errors.js';

type ClassType<T extends object> = { new (): T };

interface ValidationPipeOptions {
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  skipMissingProperties?: boolean;
  enableImplicitConversion?: boolean;
  groups?: string[];
}

type ValidationType = 'body' | 'query' | 'params';

function formatValidationErrors(errors: ClassValidatorError[]): Array<{ field: string; constraints: string[] }> {
  const formatError = (
    error: ClassValidatorError,
    parentPath = '',
  ): Array<{ field: string; constraints: string[] }> => {
    const fieldPath = parentPath ? `${parentPath}.${error.property}` : error.property;
    const result: Array<{ field: string; constraints: string[] }> = [];

    if (error.constraints) {
      result.push({
        field: fieldPath,
        constraints: Object.values(error.constraints),
      });
    }

    if (error.children && error.children.length > 0) {
      error.children.forEach(child => {
        result.push(...formatError(child, fieldPath));
      });
    }

    return result;
  };

  return errors.flatMap(error => formatError(error));
}

export function ValidationPipe<T extends object>(
  dtoClass: ClassType<T>,
  type: ValidationType = 'body',
  options?: ValidationPipeOptions,
) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const defaultOptions: ValidationPipeOptions = {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      enableImplicitConversion: type === 'query' || type === 'params',
    };

    const validationOptions = { ...defaultOptions, ...options };
    const dataToValidate = req[type];

    if (!dataToValidate || (typeof dataToValidate === 'object' && Object.keys(dataToValidate).length === 0)) {
      if (type === 'body') {
        return next();
      }
    }

    try {
      const dtoObject = plainToInstance(dtoClass, dataToValidate, {
        enableImplicitConversion: validationOptions.enableImplicitConversion ?? false,
        excludeExtraneousValues: false,
      });

      const validateOptions: Record<string, unknown> = {
        whitelist: validationOptions.whitelist ?? true,
        forbidNonWhitelisted: validationOptions.forbidNonWhitelisted ?? true,
        skipMissingProperties: validationOptions.skipMissingProperties ?? false,
        validationError: {
          target: false,
          value: false,
        },
      };

      if (validationOptions.groups) {
        validateOptions.groups = validationOptions.groups;
      }

      const errors = await validate(dtoObject, validateOptions);

      if (errors.length > 0) {
        const formattedErrors = formatValidationErrors(errors);
        const detailsMessage = JSON.stringify(formattedErrors);

        throw new ValidationError(detailsMessage);
      }

      req[type] = dtoObject as unknown;
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        next(error);
      } else {
        const internalError = new InternalServerError(VALIDATION_ERROR_MESSAGES.INTERNAL_VALIDATION_ERROR);
        next(internalError);
      }
    }
  };
}

export const ValidateBody = <T extends object>(dtoClass: ClassType<T>, options?: ValidationPipeOptions) =>
  ValidationPipe(dtoClass, 'body', options);

export const ValidateQuery = <T extends object>(dtoClass: ClassType<T>, options?: ValidationPipeOptions) =>
  ValidationPipe(dtoClass, 'query', options);

export const ValidateParams = <T extends object>(dtoClass: ClassType<T>, options?: ValidationPipeOptions) =>
  ValidationPipe(dtoClass, 'params', options);
