import { BaseError } from '@constants/errors/errors.js';
import { HTTP_STATUS } from '@constants/common/http.js';
import type { Request, Response, NextFunction } from 'express';
import { ERROR_INTERNAL_SERVER, ERROR_NO_STACK_TRACE, UNKNOWN_ERROR } from '@constants/errors/common.js';
import { SERVER_ENVIRONMENTS } from '@constants/common/server.js';

export const globalErrorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  const log = req.log;

  const isDevelopment = process.env.NODE_ENV !== SERVER_ENVIRONMENTS.PRODUCTION;
  const context = {
    method: req.method,
    url: req.originalUrl,
    ...(isDevelopment && { body: req.body }),
    params: req.params,
    query: req.query,
    user: (req as any).user || null,
  };

  if (err instanceof BaseError && err.isOperational) {
    log.warn({ err, ...context });
    const errorResponse: Record<string, unknown> = {
      statusCode: err.statusCode,
      message: err.message,
      ...(err.details && { details: err.details }),
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    };
    res.status(err.statusCode).json(errorResponse);
    return;
  }

  log.fatal({
    err,
    ...context,
    stack: err instanceof Error ? err.stack : ERROR_NO_STACK_TRACE,
    errorName: err instanceof Error ? err.name : UNKNOWN_ERROR,
  });
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: ERROR_INTERNAL_SERVER,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};
