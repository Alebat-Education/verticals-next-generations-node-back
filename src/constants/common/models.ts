import { Product } from '@api/products/productModel.js';

export const EXPORTED_MODELS = [
  // add here all exported entities for TypeORM
  Product,
];

export const MODELS_NAMES = {
  PRODUCT: 'Product',
} as const;

export type ResourceName = (typeof MODELS_NAMES)[keyof typeof MODELS_NAMES];
