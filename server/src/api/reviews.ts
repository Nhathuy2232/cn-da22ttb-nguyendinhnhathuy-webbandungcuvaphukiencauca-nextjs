import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../interfaces/http/middlewares/authMiddleware';
import reviewRepository from '../infrastructure/repositories/reviewRepositoryImpl';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API quản lý đánh giá sản phẩm
 */

/**
 * Lấy danh sách đánh giá và thống kê của sản phẩm
 * GET /api/reviews/product/:productId
 */
router.get('/product/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.productId || '0');
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
 * Lấy đánh giá của user hiện tại cho sản phẩm
 * GET /api/reviews/my-review/:productId
 */
router.get('/my-review/:productId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseInt(req.params.productId || '0');
    const userId = req.user!.id;

    const review = await reviewRepository.getUserReview(userId, productId);

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Tạo đánh giá mới
 * POST /api/reviews
 */
router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { product_id, rating, comment } = req.body;

    // Validate
    if (!product_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Đánh giá phải từ 1 đến 5 sao',
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

    // Tạo đánh giá
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
  } catch (error) {
    next(error);
  }
});

/**
 * Cập nhật đánh giá
 * PUT /api/reviews/:id
 */
router.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviewId = parseInt(req.params.id || '0');
    const userId = req.user!.id;
    const { rating, comment } = req.body;

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Đánh giá phải từ 1 đến 5 sao',
      });
    }

    const updated = await reviewRepository.update(reviewId, userId, {
      rating,
      comment,
    });

    if (!updated) {
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
 * Xóa đánh giá
 * DELETE /api/reviews/:id
 */
router.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviewId = parseInt(req.params.id || '0');
    const userId = req.user!.id;

    const deleted = await reviewRepository.delete(reviewId, userId);

    if (!deleted) {
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

export default router;
