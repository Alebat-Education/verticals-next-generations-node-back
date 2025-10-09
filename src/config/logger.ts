import pino from 'pino';
import { pinoHttp } from 'pino-http';

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
    },
  },
});

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});
