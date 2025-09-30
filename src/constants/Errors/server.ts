/**
 * Server configuration ERRORS
 * Contains all server-related ERRORS like ports, hosts, timeouts, etc.
 */

export const ERROR_PORT_IN_USE = (port: number) => `Port ${port} is already in use.`;
export const ERROR_INVALID_PORT = `Invalid port.`;
export const ERROR = 'error';
export const ERROR_DB_CONNECTION = 'Database connection error.';
export const ERROR_DB_CONNECTION_CREDENTIALS = 'Database connection error: Invalid credentials.';
export const ERROR_SERVER = (err: string) => `Server error: ${err}\n`;
