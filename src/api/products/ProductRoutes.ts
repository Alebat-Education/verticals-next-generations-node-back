import { productController } from '@/api/products/productController.js';
import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';

const router: ExpressRouter = Router();
// basic CRUD routes
router.get('/', (req, res, next) => productController.findAll(req, res, next));
router.get('/:id', (req, res, next) => productController.findOne(req, res, next));
router.post('/', (req, res, next) => productController.create(req, res, next));
router.put('/:id', (req, res, next) => productController.update(req, res, next));
router.delete('/:id', (req, res, next) => productController.delete(req, res, next));

// specific routes ...

export default router;
