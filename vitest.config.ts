import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules/', 'dist/', 'src/tests/', '**/*.d.ts', '**/*.config.*', '**/migrations/**'],
      all: true,
    },
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, './src/api/common'),
      '@products': path.resolve(__dirname, './src/products'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@errors': path.resolve(__dirname, './src/constants/errors'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@enums': path.resolve(__dirname, './src/interfaces/Enums'),
      '@middleware': path.resolve(__dirname, './src/middleware'),
      '@config': path.resolve(__dirname, './src/config'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@tests': path.resolve(__dirname, './src/tests'),
      '@migrations': path.resolve(__dirname, './src/migrations'),
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
    },
  },
});
