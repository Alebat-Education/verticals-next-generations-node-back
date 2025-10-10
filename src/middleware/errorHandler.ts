import { BaseError } from '@utils/errors.js';
import { HTTP_STATUS } from '@constants/common/server.js';
import type { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  const log = req.log;

  const isDevelopment = process.env.NODE_ENV !== 'production';

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
    stack: err instanceof Error ? err.stack : 'No stack trace available',
    errorName: err instanceof Error ? err.name : 'Unknown Error',
  });
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};
