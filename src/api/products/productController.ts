import { type Product } from '@/api/products/productModel.js';
import { productService } from '@/api/products/ProductService.js';
import { BaseController } from '@common/GlobalController.js';

export class ProductController extends BaseController<Product> {
  constructor() {
    super(productService, 'Product');
  }

  // specific routes
}

export const productController = new ProductController();
