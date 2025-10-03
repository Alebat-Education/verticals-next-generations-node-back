import { ERROR_MESSAGES } from '#constants/Errors/error-messages.js';
import { HTTP_STATUS } from '#constants/server.js';

export abstract class BaseError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

export class ConflictError extends BaseError {
  constructor(message: string = ERROR_MESSAGES.CONFLICT) {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

export class InternalServerError extends BaseError {
  constructor(message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
