import { Product } from '@/api/products/productModel.js';
import { BaseService } from '@common/GlobalService.js';
import { AppDataSource } from '@config/connection.js';
import { ERROR_DATA_SOURCE_NOT_INITIALIZED } from '@constants/errors/server.js';

class ProductService extends BaseService<Product> {
  constructor() {
    if (!AppDataSource || !AppDataSource.isInitialized) {
      throw new Error(ERROR_DATA_SOURCE_NOT_INITIALIZED);
    }
    super(AppDataSource.getRepository(Product));
  }

  // specific methods ...
}

export const productService = new ProductService();
