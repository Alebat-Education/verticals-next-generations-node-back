import { type Product } from '@/api/products/productModel.js';
import { productService } from '@/api/products/ProductService.js';
import { BaseController } from '@common/GlobalController.js';
import { MODELS_NAMES } from '@constants/common/models.js';
import { CreateProductDto } from '@/api/products/dtos/CreateProductDto.js';
import { UpdateProductDto } from '@/api/products/dtos/UpdateProductDto.js';
export class ProductController extends BaseController<Product, CreateProductDto, UpdateProductDto> {
  constructor() {
    super(productService, MODELS_NAMES.PRODUCT, CreateProductDto, UpdateProductDto);
  }
  // specific routes ...
}

export const productController = new ProductController();
