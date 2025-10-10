import pino from 'pino';
import { pinoHttp } from 'pino-http';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
        ignore: 'pid,hostname',
        singleLine: true,
        colorize: true,
      },
    },
    base: null,
  }),
});

export const httpLogger = pinoHttp({
  logger,
  quietReqLogger: true,
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customErrorMessage: function (_req, _res, error) {
    return `Request error, ${error.message}`;
  },
  customSuccessMessage: function (_req, res, _err) {
    return `Request completed with status code: ${res.statusCode}`;
  },
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        user: (req as any).user || null,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
    err(err) {
      return {
        type: err.name,
        message: err.message,
        stack: err.stack,
      };
    },
  },
});
