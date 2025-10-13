import { ERROR_MESSAGES } from '@errors/error-messages.js';
import { HTTP_STATUS } from '@constants/common/http.js';

export abstract class BaseError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: string;

  constructor(defaultMessage: string, statusCode: number, customMessage: string, isOperational: boolean = true) {
    super(defaultMessage);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = customMessage;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  constructor(customMessage?: string) {
    super(ERROR_MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST, customMessage ?? '');
  }
}

export class NotFoundError extends BaseError {
  constructor(customMessage?: string) {
    super(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND, customMessage ?? '');
  }
}

export class UnauthorizedError extends BaseError {
  constructor(customMessage?: string) {
    super(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, customMessage ?? '');
  }
}

export class ForbiddenError extends BaseError {
  constructor(customMessage?: string) {
    super(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN, customMessage ?? '');
  }
}

export class ConflictError extends BaseError {
  constructor(customMessage?: string) {
    super(ERROR_MESSAGES.CONFLICT, HTTP_STATUS.CONFLICT, customMessage ?? '');
  }
}

export class InternalServerError extends BaseError {
  constructor(customMessage?: string) {
    super(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR, customMessage ?? '', false);
  }
}

export class FatalError extends BaseError {
  constructor(customMessage?: string, originalError?: Error) {
    super(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR, customMessage ?? '', false);
    if (originalError && typeof originalError.stack === 'string') {
      this.stack = originalError.stack;
    }
  }
}
