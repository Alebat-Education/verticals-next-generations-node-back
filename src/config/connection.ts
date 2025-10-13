/**
 * @fileoverview Database connection configuration and initialization for the application.
 * This module sets up a TypeORM DataSource with MySQL replication (master-slave) support
 * and provides utilities for database initialization with environment-based configuration.
 *
 * Features:
 * - MySQL master-slave replication support
 * - Environment-based logging configuration
 * - Port validation and type conversion
 * - Automatic model discovery and registration
 * - Connection error handling with process termination
 *
 */

/**
 * Importing 'reflect-metadata' is required for TypeORM to enable the use of decorators
 * on entity classes. TypeORM relies on metadata reflection to map class properties to
 * database columns and relationships. Without this import, decorators such as @Entity,
 * @Column, and others will not function correctly, and the ORM will fail to initialize
 * entity metadata. This import should be included once in the application's entry point
 * or in any module that sets up the database connection.
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CONFIG } from '@config/index.js';
import { ERROR_DB_MISSING_ENV_VARS, ERROR_DB_CONNECTION_FAILED, ERROR_INVALID_PORT } from '@constants/errors/server.js';
import { EXPORTED_MODELS } from '@constants/common/models.js';
import { SERVER_CONFIG, SERVER_ENVIRONMENTS, SERVER_MESSAGES } from '@constants/common/server.js';
import { logger } from '@config/logger.js';

/**
 * Database configuration variables extracted from the global CONFIG object.
 * These variables contain the necessary connection parameters for MySQL replication setup.
 *
 * @constant {string} DB_HOST_READING - Hostname for the read-only database server (slave)
 * @constant {string} DB_HOST_WRITING - Hostname for the write database server (master)
 * @constant {number} DB_PORT - Port number for database connections
 * @constant {string} DB_USERNAME - Database username for authentication
 * @constant {string|undefined} DB_PASSWORD - Database password for authentication
 * @constant {string} DB_NAME - Name of the database to connect to
 */
const { DB_HOST_READING, DB_HOST_WRITING, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = CONFIG;

// Validate required environment variables
if (!DB_HOST_READING || !DB_HOST_WRITING || !DB_PORT || !DB_USERNAME || !DB_NAME) {
  throw new Error(ERROR_DB_MISSING_ENV_VARS);
}

/**
 * Parsed and validated database port number.
 * Converts the string port from environment variables to a number and validates it.
 *
 * @constant {number} parsedPort - The validated port number for database connections
 * @throws {Error} Throws ERROR_INVALID_PORT if the port is not a valid number
 */
const parsedPort = Number(DB_PORT);
if (isNaN(parsedPort)) {
  throw new Error(ERROR_INVALID_PORT);
}

/**
 * TypeORM DataSource configuration with MySQL replication support.
 *
 * This DataSource is configured with:
 * - Master-slave replication for write/read operations optimization
 * - Automatic entity discovery from imported models (EXPORTED_MODELS)
 * - Environment-based logging (disabled in production, enabled in development)
 * - Validated port number conversion from string to number
 * - Default MySQL database type from server configuration
 *
 * Configuration details:
 * - Uses SERVER_CONFIG.DEFAULT_DB_TYPE for database type
 * - Loads entities from EXPORTED_MODELS constant
 * - Logging controlled by NODE_ENV environment variable
 * - Port validation ensures numeric values
 *
 * @constant {DataSource} AppDataSource - The main TypeORM DataSource instance
 * @throws {Error} Throws an error if required environment variables are missing or invalid
 *
 * @example
 * ```typescript
 * // Initialize the database connection
 * await AppDataSource.initialize();
 *
 * // Get a repository for any registered model
 * const userRepository = AppDataSource.getRepository(User);
 *
 * // Check if DataSource is initialized
 * if (AppDataSource.isInitialized) {
 *   console.log('Database is ready');
 * }
 * ```
 */
export const AppDataSource = new DataSource({
  // Database type from server configuration constants
  type: SERVER_CONFIG.DEFAULT_DB_TYPE as 'mysql',
  replication: {
    master: {
      // Write operations server configuration
      host: DB_HOST_WRITING,
      port: parsedPort, // Validated numeric port
      username: DB_USERNAME,
      password: DB_PASSWORD || '', // Default to empty string if not provided
      database: DB_NAME,
    },
    slaves: [
      {
        // Read operations server configuration
        host: DB_HOST_READING,
        port: parsedPort, // Same validated port for consistency
        username: DB_USERNAME,
        password: DB_PASSWORD || '', // Default to empty string if not provided
        database: DB_NAME,
      },
    ],
  },
  // Use pre-imported models from constants
  entities: EXPORTED_MODELS,
  // Environment-based logging: disabled in production, enabled elsewhere
  logging: CONFIG.NODE_ENV === SERVER_ENVIRONMENTS.PRODUCTION ? false : true,
});

/**
 * Initializes the database connection using the configured AppDataSource.
 *
 * This function performs the following operations:
 * - Checks if the DataSource is already initialized to prevent duplicate connections
 * - Initializes the TypeORM DataSource with the configured MySQL replication setup
 * - Uses SERVER_MESSAGES constants for consistent logging messages
 * - Logs successful connection or errors to the console
 * - Exits the process with code 1 if connection fails
 *
 * Error handling:
 * - Catches and logs all initialization errors
 * - Uses standardized error messages from constants
 * - Terminates process on failure to prevent invalid application state
 *
 * @async
 * @function initDB
 * @returns {Promise<void>} A promise that resolves when the database is successfully initialized
 * @throws {Error} Logs error and exits process if database connection fails
 *
 * @example
 * ```typescript
 * // Initialize database on application startup
 * import { initDB } from '@config/connection.js';
 *
 * async function startApplication() {
 *   await initDB();
 *   console.log('Application ready - database connected');
 *   // Continue with application startup...
 * }
 *
 * // The function will automatically handle failures
 * startApplication().catch(console.error);
 * ```
 */
export const initDB = async (): Promise<void> => {
  try {
    // Prevent multiple initialization attempts - TypeORM handles this internally
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();

      logger.info(SERVER_MESSAGES.SUCCESS_DB_CONNECTED);
    }
  } catch (error) {
    logger.fatal({ err: error }, ERROR_DB_CONNECTION_FAILED);
    process.exit(1);
  }
};
