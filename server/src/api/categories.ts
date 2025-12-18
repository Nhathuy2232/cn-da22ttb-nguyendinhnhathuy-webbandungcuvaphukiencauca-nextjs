import { Router } from 'express';
import categoryController from '../modules/categories/category.controller';

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Lấy danh sách danh mục
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/', categoryController.getAll.bind(categoryController));

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Lấy chi tiết danh mục
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Chi tiết danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get('/:id', categoryController.getById.bind(categoryController));

export default router;
