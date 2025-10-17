import { productController } from '@/api/products/productController.js';
import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { ValidateBody, ValidateParams } from '@middleware/validation-pipe.js';
import { CreateProductDto } from '@/api/products/dtos/CreateProductDto.js';
import { UpdateProductDto } from '@/api/products/dtos/UpdateProductDto.js';
import { ParamIdDto } from '@common/dtos/ParamIdDto.js';

const router: ExpressRouter = Router();

router.get('/', (req, res, next) => productController.findAll(req, res, next));

router.get('/:id', ValidateParams(ParamIdDto), (req, res, next) => productController.findOne(req, res, next));

router.post('/', ValidateBody(CreateProductDto), (req, res, next) => productController.create(req, res, next));

router.put('/:id', ValidateParams(ParamIdDto), ValidateBody(UpdateProductDto), (req, res, next) =>
  productController.update(req, res, next),
);

router.patch(
  '/:id',
  ValidateParams(ParamIdDto),
  ValidateBody(UpdateProductDto, { skipMissingProperties: true }),
  (req, res, next) => productController.update(req, res, next),
);

router.delete('/:id', ValidateParams(ParamIdDto), (req, res, next) => productController.delete(req, res, next));

export default router;
