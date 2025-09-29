import { config } from 'dotenv';

// Load environment variables
config();

export const CONFIG = {
  // Server
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  NODE_ENV: process.env.NODE_ENV,

  // Database
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT || '3306'),
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL,
} as const;
