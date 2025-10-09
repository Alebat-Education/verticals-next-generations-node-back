/**
 * Server configuration constants
 * Contains all server-related constants like ports, hosts, timeouts, etc.
 */

export const SERVER_CONFIG = {
  DEFAULT_PORT: 3000,
  DEFAULT_DB_PORT: 3306,
  HOME: '/',
  HOST: '127.0.0.1',
  DEFAULT_DB_TYPE: 'mysql',
} as const;

export const SERVER_MESSAGES = {
  STARTING(port: number) {
    return `Server started and is running on port: ${port}\n`;
  },
  READY: `Server started and READY!`,
  LISTENING: `listening`,
  SUCCESS_DB_CONNECTED: 'Connected to database successfully.',
} as const;

export const SERVER_ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;
export const CODE_ADDRESS_IN_USE = 'EADDRINUSE';
export const CODE_SERVER_TERMINATED = 'SIGTERM';
