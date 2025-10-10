import { Product } from '@/api/products/productModel.js';
import { BaseService } from '@common/GlobalService.js';
import { AppDataSource } from '@config/connection.js';

class ProductService extends BaseService<Product> {
  constructor() {
    if (!AppDataSource || !AppDataSource.isInitialized) {
      throw new Error('DataSource must be initialized before creating ProductService (llama initDB() primero)');
    }

    const repo = AppDataSource.getRepository(Product);
    super(repo);
  }

  // specific methods
}

export const productService = new ProductService();
