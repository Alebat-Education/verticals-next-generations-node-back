import { type Product } from '@/api/products/productModel.js';
import { productService } from '@api/products/productService.js';
import { BaseController } from '@common/GlobalController.js';
import { MODELS_NAMES } from '@constants/common/models.js';
import type { CreateProductDto } from '@/api/products/dtos/CreateProductDto.js';
import type { UpdateProductDto } from '@/api/products/dtos/UpdateProductDto.js';

export class ProductController extends BaseController<Product, CreateProductDto, UpdateProductDto> {
  constructor() {
    super(productService, MODELS_NAMES.PRODUCT);
  }
  // specific routes ...
}

export const productController = new ProductController();
