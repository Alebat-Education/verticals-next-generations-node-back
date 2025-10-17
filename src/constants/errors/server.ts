/**
 * Server configuration ERRORS
 * Contains all server-related ERRORS like ports, hosts, timeouts, etc.
 */

export const ERROR_PORT_IN_USE = (port: number) => `Port ${port} is already in use.`;
export const ERROR_INVALID_PORT = `Invalid port.`;
export const ERROR = 'error';
export const ERROR_SERVER = (err: string) => `Server error: ${err}\n`;
export const ERROR_DB_MISSING_ENV_VARS =
  'Missing required environment variables for database configuration. Please check your .env file';
export const ERROR_DATABASE_GENERIC = 'Database error occurred';
export const ERROR_DB_CONNECTION_FAILED = 'Error connecting to database';
export const ERROR_SETTING_UP_ROUTES = 'Error setting up routes';
export const ERROR_DATA_SOURCE_NOT_INITIALIZED = 'DataSource must be initialized before creating ProductService';
