import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CONFIG } from '@config/index.js';
import { ERROR_DB_MISSING_ENV_VARS, ERROR_DB_CONNECTION_FAILED, ERROR_INVALID_PORT } from '@errors/server.js';
import { EXPORTED_MODELS } from '@constants/models.js';
import { SERVER_CONFIG, SERVER_ENVIRONMENTS, SERVER_MESSAGES } from '@constants/server.js';

const { DB_HOST_READING, DB_HOST_WRITING, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = CONFIG;

if (!DB_HOST_READING || !DB_HOST_WRITING || !DB_PORT || !DB_USERNAME || !DB_NAME) {
  throw new Error(ERROR_DB_MISSING_ENV_VARS);
}

const parsedPort = Number(DB_PORT);
if (isNaN(parsedPort)) {
  throw new Error(ERROR_INVALID_PORT);
}

export const AppDataSource = new DataSource({
  type: SERVER_CONFIG.DEFAULT_DB_TYPE as 'mysql',
  replication: {
    master: {
      // write
      host: DB_HOST_WRITING,
      port: parsedPort,
      username: DB_USERNAME,
      password: DB_PASSWORD || '',
      database: DB_NAME,
    },
    slaves: [
      // read-only
      {
        host: DB_HOST_READING,
        port: parsedPort,
        username: DB_USERNAME,
        password: DB_PASSWORD || '',
        database: DB_NAME,
      },
    ],
  },
  entities: EXPORTED_MODELS,
  logging: CONFIG.NODE_ENV === SERVER_ENVIRONMENTS.PRODUCTION ? false : true,
});

export const initDB = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();

      // eslint-disable-next-line no-console
      console.log(SERVER_MESSAGES.SUCCESS_DB_CONNECTED);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(ERROR_DB_CONNECTION_FAILED, error);
    process.exit(1);
  }
};
