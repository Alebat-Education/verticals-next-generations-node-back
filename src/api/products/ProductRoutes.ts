import { productController } from '@/api/products/productController.js';
import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { ValidateBody, ValidateQuery, ValidateParams } from '@middleware/validation-pipe.js';
import { CreateProductDto } from '@/api/products/dtos/CreateProductDto.js';
import { UpdateProductDto } from '@/api/products/dtos/UpdateProductDto.js';
import { QueryProductDto } from '@/api/products/dtos/QueryProductDto.js';
import { ParamProductDto } from '@/api/products/dtos/ParamProductDto.js';

const router: ExpressRouter = Router();

router.get('/', ValidateQuery(QueryProductDto), (req, res, next) => productController.findAll(req, res, next));

router.get('/:id', ValidateParams(ParamProductDto), (req, res, next) => productController.findOne(req, res, next));

router.post('/', ValidateBody(CreateProductDto), (req, res, next) => productController.create(req, res, next));

router.put('/:id', ValidateParams(ParamProductDto), ValidateBody(UpdateProductDto), (req, res, next) =>
  productController.update(req, res, next),
);

router.patch(
  '/:id',
  ValidateParams(ParamProductDto),
  ValidateBody(UpdateProductDto, { skipMissingProperties: true }),
  (req, res, next) => productController.update(req, res, next),
);

router.delete('/:id', ValidateParams(ParamProductDto), (req, res, next) => productController.delete(req, res, next));

export default router;
