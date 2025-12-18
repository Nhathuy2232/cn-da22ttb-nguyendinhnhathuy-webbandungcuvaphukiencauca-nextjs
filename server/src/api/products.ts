import { Router } from 'express';
import productController from '../modules/products/product.controller';
import { authenticate, authorize } from '../interfaces/http/middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Lấy danh sách sản phẩm
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên hoặc mô tả
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo ID danh mục
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Số lượng sản phẩm mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', productController.getAll.bind(productController));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Lấy chi tiết sản phẩm
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get('/:id', productController.getById.bind(productController));

export default router;
