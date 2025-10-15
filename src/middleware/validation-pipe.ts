import { plainToInstance } from 'class-transformer';
import { validate, type ValidationError as ClassValidatorError } from 'class-validator';
import type { Response, NextFunction } from 'express';
import { VALIDATION_ERROR_MESSAGES } from '@errors/validation/messages.js';
import { VALIDATION_TYPES, VALIDATION_OPTIONS } from '@errors/validation/rules.js';
import { ValidationError, InternalServerError } from '@errors/errors.js';
import type {
  ValidationPipeOptions,
  ValidationType,
  ClassType,
  RequestWithValidation,
} from '@interfaces/validation-pipe.js';

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
  type: ValidationType = VALIDATION_TYPES.BODY,
  options?: ValidationPipeOptions,
) {
  return async (req: RequestWithValidation, _res: Response, next: NextFunction): Promise<void> => {
    const defaultOptions: ValidationPipeOptions = {
      whitelist: VALIDATION_OPTIONS.DEFAULT.WHITELIST,
      forbidNonWhitelisted: VALIDATION_OPTIONS.DEFAULT.FORBID_NON_WHITELISTED,
      skipMissingProperties: VALIDATION_OPTIONS.DEFAULT.SKIP_MISSING_PROPERTIES,
      enableImplicitConversion: type === VALIDATION_TYPES.QUERY || type === VALIDATION_TYPES.PARAMS,
    };

    const validationOptions = { ...defaultOptions, ...options };
    const dataToValidate = req[type];

    if (!dataToValidate || (typeof dataToValidate === 'object' && Object.keys(dataToValidate).length === 0)) {
      if (type === VALIDATION_TYPES.BODY) {
        return next();
      }
    }

    try {
      const dtoObject = plainToInstance(dtoClass, dataToValidate, {
        enableImplicitConversion: validationOptions.enableImplicitConversion ?? false,
        excludeExtraneousValues: VALIDATION_OPTIONS.DEFAULT.EXCLUDE_EXTRANEOUS_VALUES,
      });

      const validateOptions: Record<string, unknown> = {
        whitelist: validationOptions.whitelist ?? VALIDATION_OPTIONS.DEFAULT.WHITELIST,
        forbidNonWhitelisted:
          validationOptions.forbidNonWhitelisted ?? VALIDATION_OPTIONS.DEFAULT.FORBID_NON_WHITELISTED,
        skipMissingProperties:
          validationOptions.skipMissingProperties ?? VALIDATION_OPTIONS.DEFAULT.SKIP_MISSING_PROPERTIES,
        validationError: {
          target: VALIDATION_OPTIONS.VALIDATION_ERROR.TARGET,
          value: VALIDATION_OPTIONS.VALIDATION_ERROR.VALUE,
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
  ValidationPipe(dtoClass, VALIDATION_TYPES.BODY, options);

export const ValidateQuery = <T extends object>(dtoClass: ClassType<T>, options?: ValidationPipeOptions) =>
  ValidationPipe(dtoClass, VALIDATION_TYPES.QUERY, options);

export const ValidateParams = <T extends object>(dtoClass: ClassType<T>, options?: ValidationPipeOptions) =>
  ValidationPipe(dtoClass, VALIDATION_TYPES.PARAMS, options);
