/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique product ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Product name
 *           example: Laptop HP
 *           minLength: 3
 *           maxLength: 100
 *         description:
 *           type: string
 *           description: Detailed product description
 *           example: HP Laptop with Intel Core i7 processor
 *           maxLength: 500
 *         price:
 *           type: number
 *           format: float
 *           description: Product price
 *           example: 999.99
 *           minimum: 0
 *         stock:
 *           type: integer
 *           description: Inventory quantity
 *           example: 50
 *           minimum: 0
 *           default: 0
 *         category:
 *           type: string
 *           description: Product category
 *           example: Electronics
 *         isActive:
 *           type: boolean
 *           description: Product status
 *           example: true
 *           default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date
 *           example: 2025-10-08T12:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date
 *           example: 2025-10-08T12:00:00.000Z
 *
 */
