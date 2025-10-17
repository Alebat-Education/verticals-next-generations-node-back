import { productController } from '@/api/products/productController.js';
import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { ValidateBody, ValidateParams } from '@middleware/validation-pipe.js';
import { CreateProductDto } from '@/api/products/dtos/CreateProductDto.js';
import { UpdateProductDto } from '@/api/products/dtos/UpdateProductDto.js';
import { ParamIdDto } from '@common/dtos/ParamIdDto.js';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve all products with optional relations (categories, components)
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/includeQuery'
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *             example:
 *               message: Products retrieved successfully
 *               data:
 *                 - id: 1
 *                   documentId: prod_123abc
 *                   title: Full Stack Developer Course
 *                   SKU: FSC-2025-001
 *                   vertical: [TECH]
 *                   type: COURSE
 *                   stripeCrm: STRIPE
 *                   enrolButton: true
 *                   formButton: true
 *                   isSoon: false
 *                   instalmentsPrice: false
 *                   contract: true
 *                   subscriptionType: PREMIUM
 *                   hasLaabConnection: true
 *                   isPremium: false
 *                   createdAt: 2025-10-08T12:00:00.000Z
 *                   updatedAt: 2025-10-08T12:00:00.000Z
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/', (req, res, next) => productController.findAll(req, res, next));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve a single product by ID with optional relations
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *       - $ref: '#/components/parameters/includeQuery'
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *             example:
 *               message: Product retrieved successfully
 *               data:
 *                 id: 1
 *                 documentId: prod_123abc
 *                 title: Full Stack Developer Course
 *                 SKU: FSC-2025-001
 *                 vertical: [TECH]
 *                 type: COURSE
 *                 stripeCrm: STRIPE
 *                 categories:
 *                   - id: 1
 *                     name: Programming
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', ValidateParams(ParamIdDto), (req, res, next) => productController.findOne(req, res, next));

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with validation
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDto'
 *           example:
 *             title: Full Stack Developer Course
 *             SKU: FSC-2025-001
 *             vertical: [TECH]
 *             type: COURSE
 *             stripeCrm: STRIPE
 *             documentId: prod_123abc
 *             slug: full-stack-developer-course
 *             order: 1
 *             enrolButton: true
 *             formButton: true
 *             contract: true
 *             subscriptionType: PREMIUM
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *             example:
 *               message: Product created successfully
 *               data:
 *                 id: 1
 *                 documentId: prod_123abc
 *                 title: Full Stack Developer Course
 *                 SKU: FSC-2025-001
 *                 vertical: [TECH]
 *                 type: COURSE
 *                 stripeCrm: STRIPE
 *                 createdAt: 2025-10-08T12:00:00.000Z
 *                 updatedAt: 2025-10-08T12:00:00.000Z
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/', ValidateBody(CreateProductDto), (req, res, next) => productController.create(req, res, next));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product (full update)
 *     description: Update an existing product with all fields
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductDto'
 *           example:
 *             title: Full Stack Developer Course Advanced
 *             slug: full-stack-developer-course-advanced
 *             order: 2
 *             vertical: [TECH, BUSINESS]
 *             type: BOOTCAMP
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *             example:
 *               message: Product updated successfully
 *               data:
 *                 id: 1
 *                 title: Full Stack Developer Course Advanced
 *                 updatedAt: 2025-10-08T14:00:00.000Z
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put('/:id', ValidateParams(ParamIdDto), ValidateBody(UpdateProductDto), (req, res, next) =>
  productController.update(req, res, next),
);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product (partial update)
 *     description: Update an existing product with only the fields you want to change
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductDto'
 *           example:
 *             title: Updated Title Only
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *             example:
 *               message: Product updated successfully
 *               data:
 *                 id: 1
 *                 title: Updated Title Only
 *                 updatedAt: 2025-10-08T14:00:00.000Z
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch(
  '/:id',
  ValidateParams(ParamIdDto),
  ValidateBody(UpdateProductDto, { skipMissingProperties: true }),
  (req, res, next) => productController.update(req, res, next),
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *             example:
 *               message: Product deleted successfully
 *               data:
 *                 id: 1
 *                 title: Full Stack Developer Course
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete('/:id', ValidateParams(ParamIdDto), (req, res, next) => productController.delete(req, res, next));

export default router;
