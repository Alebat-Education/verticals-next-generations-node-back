import { type Product } from '@/api/products/productModel.js';
import { productService } from '@/api/products/ProductService.js';
import { BaseController } from '@common/GlobalController.js';
import { STATUS } from '@constants/common/http.js';
import { ProductType } from '@interfaces/Enums/product.js';
import type { ApiErrorResponse, ApiSuccessResponse } from '@interfaces/http.js';
import type { Request, Response } from 'express';

export class ProductController extends BaseController<Product> {
  constructor() {
    super(productService, 'Product');
  }

  // specific routes
  async getByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;

      if (!Object.values(ProductType).includes(type as ProductType)) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          message: 'Tipo de producto inválido',
          error: 'Invalid product type',
          statusCode: STATUS.BAD_REQUEST,
        };
        res.status(STATUS.BAD_REQUEST).json(errorResponse);
        return;
      }

      const products = await productService.findByType(type as ProductType);

      const response: ApiSuccessResponse<Product[]> = {
        success: true,
        message: `Productos de tipo ${type} obtenidos exitosamente`,
        data: products,
      };

      res.status(STATUS.OK).json(response);
    } catch (error) {
      console.log(error);
    }
  }
}

export const productController = new ProductController();
