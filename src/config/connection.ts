import 'reflect-metadata';
import { CONFIG } from '@config/index.js';
import { DataSource } from 'typeorm';
import { ERROR_DB_MISSING_ENV_VARS, ERROR_DB_CONNECTION_FAILED, SUCCESS_DB_CONNECTED } from '@errors/server.js';

const { DB_HOST_READING, DB_HOST_WRITING, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = CONFIG;

if (!DB_HOST_READING || !DB_HOST_WRITING || !DB_PORT || !DB_USERNAME || !DB_NAME) {
  throw new Error(ERROR_DB_MISSING_ENV_VARS);
}

export const AppDataSource = new DataSource({
  type: 'mysql',
  replication: {
    master: {
      // write
      host: DB_HOST_WRITING,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD || '',
      database: DB_NAME,
    },
    slaves: [
      // read-only
      {
        host: DB_HOST_READING,
        port: DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD || '',
        database: DB_NAME,
      },
    ],
  },
  entities: ['src/models/**/*.ts'],
  logging: true,
});

export const initDB = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();

      // eslint-disable-next-line no-console
      console.log(SUCCESS_DB_CONNECTED);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(ERROR_DB_CONNECTION_FAILED, error);
    process.exit(1);
  }
};
