import 'reflect-metadata';
import { CONFIG } from '#config/index.js';
import { DataSource } from 'typeorm';

const { DB_HOST_READING, DB_HOST_WRITING, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = CONFIG;

if (!DB_HOST_READING || !DB_HOST_WRITING || !DB_PORT || !DB_USERNAME || !DB_NAME) {
  throw new Error('🚨 Faltan variables de entorno para la configuración de la base de datos. Verifica tu archivo .env');
}

export const AppDataSource = new DataSource({
  type: 'mysql',
  replication: {
    master: {
      // write
      host: DB_HOST_WRITING,
      port: Number(DB_PORT) || 3306,
      username: DB_USERNAME,
      password: DB_PASSWORD || '',
      database: DB_NAME,
    },
    slaves: [
      // read-only
      {
        host: DB_HOST_READING,
        port: Number(DB_PORT) || 3306,
        username: DB_USERNAME,
        password: DB_PASSWORD || '',
        database: DB_NAME,
      },
    ],
  },
  entities: ['src/models/**/*.ts'],
  logging: true,
});

export const initDB = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();

      console.log('✅ Conectado a la BD con replicación (master/slave)');
    }
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos', error);
    process.exit(1);
  }
};
