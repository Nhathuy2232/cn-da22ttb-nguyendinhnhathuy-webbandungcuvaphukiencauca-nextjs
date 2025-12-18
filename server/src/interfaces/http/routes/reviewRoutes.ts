import { Router, Request, Response, NextFunction } from 'express';
import reviewRepository from '../../infrastructure/repositories/reviewRepository';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API quản lý đánh giá sản phẩm
 */

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Lấy danh sách đánh giá của sản phẩm
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Danh sách đánh giá
 */
router.get('/product/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.productId);
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const [reviews, stats] = await Promise.all([
      reviewRepository.getByProduct(productId, limit, offset),
      reviewRepository.getProductStats(productId),
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Tạo đánh giá mới
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - rating
 *             properties:
 *               product_id:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đánh giá được tạo thành công
 */
router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập',
      });
    }

    const { product_id, rating, comment } = req.body;

    if (!product_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Đánh giá phải từ 1-5 sao',
      });
    }

    // Kiểm tra đã đánh giá chưa
    const hasReviewed = await reviewRepository.hasUserReviewed(userId, product_id);
    if (hasReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đánh giá sản phẩm này rồi',
      });
    }

    const review = await reviewRepository.create({
      productId: product_id,
      userId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: 'Đánh giá thành công',
      data: review,
    });
  } catch (error: any) {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không tồn tại',
      });
    }
    next(error);
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Cập nhật đánh giá
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập',
      });
    }

    const id = parseInt(req.params.id);
    const { rating, comment } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Đánh giá phải từ 1-5 sao',
      });
    }

    const success = await reviewRepository.update(id, userId, { rating, comment });

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá hoặc bạn không có quyền chỉnh sửa',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật đánh giá thành công',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Xóa đánh giá
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập',
      });
    }

    const id = parseInt(req.params.id);
    const success = await reviewRepository.delete(id, userId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá hoặc bạn không có quyền xóa',
      });
    }

    res.json({
      success: true,
      message: 'Xóa đánh giá thành công',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/reviews/my-review/{productId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Lấy đánh giá của user cho sản phẩm
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đánh giá của user
 */
router.get('/my-review/:productId', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập',
      });
    }

    const productId = parseInt(req.params.productId);
    const review = await reviewRepository.getUserReview(userId, productId);

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
