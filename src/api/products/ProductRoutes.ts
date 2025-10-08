import { productController } from '@/api/products/productController.js';
import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';

const router: ExpressRouter = Router();
// basic CRUD routes
router.get('/', (req, res) => productController.findAll(req, res));
router.get('/:id', (req, res) => productController.findOne(req, res));
router.post('/', (req, res) => productController.create(req, res));
router.put('/:id', (req, res) => productController.update(req, res));
router.delete('/:id', (req, res) => productController.delete(req, res));

// specific routes
router.get('/type/:type', (req, res) => productController.getByType(req, res));

export default router;
