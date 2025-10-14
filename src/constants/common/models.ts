import { Product } from '@api/products/productModel.js';
import { Category } from '@api/categories/categoryModel.js';
import { FullPriceComponent } from '@api/products/components/FullPriceComponent.js';
import { ProductComponent } from '@api/products/components/ProductComponent.js';
import { CardTagsComponent } from '@api/products/components/CardTagsComponent.js';
import { BaseComponentEntity } from '@common/BaseComponentEntity.js';

export const EXPORTED_MODELS = [
  Product,
  Category,
  FullPriceComponent,
  ProductComponent,
  CardTagsComponent,
  BaseComponentEntity,
];

export const MODELS_NAMES = {
  PRODUCT: 'Product',
} as const;

export type ResourceName = (typeof MODELS_NAMES)[keyof typeof MODELS_NAMES];
