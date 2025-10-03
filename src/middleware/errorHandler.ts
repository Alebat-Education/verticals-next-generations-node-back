import type { ErrorResponse } from '#interfaces/errors.ts';
import type { Request, Response, NextFunction } from 'express';
import { BaseError } from '#types/errors.js';
import { HTTP_STATUS } from '#constants/server.js';
import { ERROR_MESSAGES } from '#constants/Errors/error-messages.js';

const SERVER_MODE = 'development';

export const globalErrorHandler = (error: Error, _req: Request, res: Response): void => {
  let response: ErrorResponse;

  if (error instanceof BaseError) {
    response = {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    };
    res.status(error.statusCode).json(response);
    return;
  }

  response = {
    success: false,
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === SERVER_MODE) {
    console.error(error.message, error.stack);
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    statusCode: HTTP_STATUS.NOT_FOUND,
    timestamp: new Date().toISOString(),
  });
};

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
