import { Product } from '@/api/products/productModel.js';
import { BaseService } from '@common/GlobalService.js';
import { AppDataSource } from '@config/connection.js';
import type { ProductType } from '@interfaces/Enums/product.js';

class ProductService extends BaseService<Product> {
  constructor() {
    // No usar Product.getRepository() (evita BaseEntity side-effects)
    if (!AppDataSource || !AppDataSource.isInitialized) {
      throw new Error('DataSource must be initialized before creating ProductService (llama initDB() primero)');
    }

    const repo = AppDataSource.getRepository(Product);
    super(repo);
  }

  async findByType(type: ProductType): Promise<Product[]> {
    return await this.repository.find({
      where: { type },
      cache: 30000,
    });
  }
}

export const productService = new ProductService();
