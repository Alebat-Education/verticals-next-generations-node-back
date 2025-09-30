/**
 * Server configuration constants
 * Contains all server-related constants like ports, hosts, timeouts, etc.
 */

export const SERVER_CONFIG = {
  DEFAULT_PORT: 3000,
  HOME: '/',
  HOST: '127.0.0.1',
  DEFAULT_DB_PORT: 3306,
} as const;

export const SERVER_MESSAGES = {
  STARTING(port: number) {
    return `Server started and is running on port: ${port}\n`;
  },
  READY: `Server started and READY!`,
  LISTENING: `listening`,
} as const;

export const SERVER_ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const CODE_ADDRESS_IN_USE = 'EADDRINUSE';
export const CODE_SERVER_TERMINATED = 'SIGTERM';
