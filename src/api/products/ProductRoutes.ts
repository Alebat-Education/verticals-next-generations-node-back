import { productController } from '@/api/products/productController.js';
import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { ValidateBody, ValidateQuery, ValidateParams } from '@middleware/validation-pipe.js';
import { CreateProductDto } from '@/api/products/dtos/CreateProductDto.js';
import { UpdateProductDto } from '@/api/products/dtos/UpdateProductDto.js';
import { QueryProductDto } from '@/api/products/dtos/QueryProductDto.js';
import { ParamProductDto } from '@/api/products/dtos/ParamProductDto.js';

const router: ExpressRouter = Router();

router.get('/', ValidateQuery(QueryProductDto), (req, res) => productController.findAll(req, res));
router.get('/:id', ValidateParams(ParamProductDto), (req, res) => productController.findOne(req, res));
router.post('/', ValidateBody(CreateProductDto), (req, res) => productController.create(req, res));
router.put(
  '/:id',
  ValidateParams(ParamProductDto),
  ValidateBody(UpdateProductDto, { skipMissingProperties: true }),
  (req, res) => productController.update(req, res),
);
router.delete('/:id', ValidateParams(ParamProductDto), (req, res) => productController.delete(req, res));
router.get('/type/:type', (req, res) => productController.getByType(req, res));

export default router;
