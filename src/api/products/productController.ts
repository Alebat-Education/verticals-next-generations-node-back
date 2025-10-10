import { type Product } from '@/api/products/productModel.js';
import { productService } from '@/api/products/ProductService.js';
import { BaseController } from '@common/GlobalController.js';
import { STATUS } from '@constants/common/http.js';
import { API_MESSAGES } from '@constants/common/messages.js';
import { ProductType } from '@interfaces/Enums/product.js';
import type { ApiErrorResponse, ApiSuccessResponse } from '@interfaces/http.js';
import type { Request, Response } from 'express';

const MESSAGES = API_MESSAGES.PRODUCTS;

export class ProductController extends BaseController<Product> {
  constructor() {
    super(productService, 'Product');
  }

  async getByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;

      if (!Object.values(ProductType).includes(type as ProductType)) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          message: MESSAGES.INVALID_TYPE,
          error: MESSAGES.INVALID_TYPE,
          statusCode: STATUS.BAD_REQUEST,
        };
        res.status(STATUS.BAD_REQUEST).json(errorResponse);
        return;
      }

      const products = await productService.findByType(type as ProductType);

      const response: ApiSuccessResponse<Product[]> = {
        success: true,
        message: MESSAGES.RETRIEVED_BY_TYPE_SUCCESS(type || ''),
        data: products,
      };

      res.status(STATUS.OK).json(response);
    } catch (error) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        message: MESSAGES.FETCH_BY_TYPE_ERROR,
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: STATUS.INTERNAL_SERVER_ERROR,
      };
      res.status(STATUS.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  }
}

export const productController = new ProductController();
