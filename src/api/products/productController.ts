import { type Product } from '@/api/products/productModel.js';
import { productService } from '@/api/products/ProductService.js';
import { BaseController } from '@common/GlobalController.js';
import { MODELS_NAMES } from '@constants/common/models.js';
export class ProductController extends BaseController<Product> {
  constructor() {
    super(productService, MODELS_NAMES.PRODUCT);
  }
  // specific routes ...
}

export const productController = new ProductController();
