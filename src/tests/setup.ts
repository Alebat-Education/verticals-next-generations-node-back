import { beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import { AppDataSource } from '@config/connection.js';

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

beforeEach(async () => {});

afterEach(async () => {});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});
