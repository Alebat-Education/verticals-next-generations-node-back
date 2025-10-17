import { ERROR_SETTING_UP_ROUTES } from '@constants/errors/server.js';
import { type Express } from 'express';
import { FatalError } from '@constants/errors/errors.js';
import { logger } from '@config/logger.js';

export async function setupRoutes(app: Express): Promise<void> {
  const PRODUCTION_ROUTES = {
    PRODUCTS: () => import('@/api/products/productsRoutes.js'),

    // Add more routes here as needed
  };

  const PATHS = {
    PRODUCTS: '/products',

    // Add more paths here as needed
  };

  try {
    app.use(PATHS.PRODUCTS, (await PRODUCTION_ROUTES.PRODUCTS()).default);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.fatal(`${ERROR_SETTING_UP_ROUTES}: ${errorMessage}`);
    throw new FatalError(ERROR_SETTING_UP_ROUTES, error instanceof Error ? error : undefined);
  }
}
