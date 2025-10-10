import { ERROR_SETTING_UP_ROUTES } from '@constants/errors/server.js';
import { type Express } from 'express';

export async function setupRoutes(app: Express): Promise<void> {
  const PRODUCTION_ROUTES = {
    PRODUCTS: () => import('@/api/products/ProductRoutes.js'),

    // Add more routes here as needed
  };

  try {
    app.use('/products', (await PRODUCTION_ROUTES.PRODUCTS()).default);
  } catch (error) {
    throw new Error(`${ERROR_SETTING_UP_ROUTES}: ${error}`);
  }
}
