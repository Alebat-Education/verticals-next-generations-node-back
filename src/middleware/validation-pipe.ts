import { plainToInstance } from 'class-transformer';
import { validate, type ValidationError } from 'class-validator';
import type { Request, Response, NextFunction } from 'express';
import { STATUS } from '@constants/common/http.js';
import { VALIDATION_ERROR_MESSAGES } from '@constants/validation/index.js';

type ClassType<T extends object> = { new (): T };

interface ValidationPipeOptions {
  whitelist?: boolean;
  forbidNonWhitelisted?: boolean;
  skipMissingProperties?: boolean;
  enableImplicitConversion?: boolean;
  groups?: string[];
}

type ValidationType = 'body' | 'query' | 'params';

function formatValidationErrors(errors: ValidationError[]): Array<{ field: string; constraints: string[] }> {
  const formatError = (error: ValidationError, parentPath = ''): Array<{ field: string; constraints: string[] }> => {
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

const VALIDATION_TYPE_MESSAGES: Record<ValidationType, string> = {
  body: VALIDATION_ERROR_MESSAGES.VALIDATION_FAILED_BODY,
  query: VALIDATION_ERROR_MESSAGES.VALIDATION_FAILED_QUERY,
  params: VALIDATION_ERROR_MESSAGES.VALIDATION_FAILED_PARAMS,
};

export function ValidationPipe<T extends object>(
  dtoClass: ClassType<T>,
  type: ValidationType = 'body',
  options?: ValidationPipeOptions,
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

      const validateOptions: Record<string, any> = {
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

        return res.status(STATUS.BAD_REQUEST).json({
          success: false,
          message: VALIDATION_TYPE_MESSAGES[type],
          errors: formattedErrors,
          statusCode: STATUS.BAD_REQUEST,
        }) as any;
      }

      req[type] = dtoObject as any;
      next();
    } catch (error) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: VALIDATION_ERROR_MESSAGES.INTERNAL_VALIDATION_ERROR,
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: STATUS.INTERNAL_SERVER_ERROR,
      }) as any;
    }
  };
}

export const ValidateBody = <T extends object>(dtoClass: ClassType<T>, options?: ValidationPipeOptions) =>
  ValidationPipe(dtoClass, 'body', options);

export const ValidateQuery = <T extends object>(dtoClass: ClassType<T>, options?: ValidationPipeOptions) =>
  ValidationPipe(dtoClass, 'query', options);

export const ValidateParams = <T extends object>(dtoClass: ClassType<T>, options?: ValidationPipeOptions) =>
  ValidationPipe(dtoClass, 'params', options);
