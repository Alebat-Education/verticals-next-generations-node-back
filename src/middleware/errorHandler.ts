import { BaseError } from '@utils/errors.js';
import { HTTP_STATUS } from '@constants/common/server.js';
import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware global para manejo de errores.
 * Clasifica errores operacionales y responde con el status adecuado.
 * @see https://expressjs.com/en/guide/error-handling.html
 */
export const globalErrorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof BaseError && err.isOperational) {
    const errorResponse: Record<string, unknown> = {
      statusCode: err.statusCode,
      message: err.message,
      ...(err.details && { details: err.details }),
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    };
    res.status(Number(err.statusCode)).json(errorResponse);
    return;
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};
