"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const reviewRepositoryImpl_1 = __importDefault(require("../../../infrastructure/repositories/reviewRepositoryImpl"));
const router = (0, express_1.Router)();
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
router.get('/product/:productId', async (req, res, next) => {
    try {
        const productId = parseInt(req.params.productId || '0');
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const [reviews, stats] = await Promise.all([
            reviewRepositoryImpl_1.default.getByProduct(productId, limit, offset),
            reviewRepositoryImpl_1.default.getProductStats(productId),
        ]);
        res.json({
            success: true,
            data: {
                reviews,
                stats,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Lấy đánh giá của user hiện tại cho sản phẩm
 * GET /api/reviews/my-review/:productId
 */
router.get('/my-review/:productId', authMiddleware_1.authenticate, async (req, res, next) => {
    try {
        const productId = parseInt(req.params.productId || '0');
        const userId = req.user.id;
        const review = await reviewRepositoryImpl_1.default.getUserReview(userId, productId);
        res.json({
            success: true,
            data: review,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Tạo đánh giá mới
 * POST /api/reviews
 */
router.post('/', authMiddleware_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.user.id;
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
        const hasReviewed = await reviewRepositoryImpl_1.default.hasUserReviewed(userId, product_id);
        if (hasReviewed) {
            return res.status(400).json({
                success: false,
                message: 'Bạn đã đánh giá sản phẩm này rồi',
            });
        }
        // Tạo đánh giá
        const review = await reviewRepositoryImpl_1.default.create({
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
    }
    catch (error) {
        next(error);
    }
});
/**
 * Cập nhật đánh giá
 * PUT /api/reviews/:id
 */
router.put('/:id', authMiddleware_1.authenticate, async (req, res, next) => {
    try {
        const reviewId = parseInt(req.params.id || '0');
        const userId = req.user.id;
        const { rating, comment } = req.body;
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: 'Đánh giá phải từ 1 đến 5 sao',
            });
        }
        const updated = await reviewRepositoryImpl_1.default.update(reviewId, userId, {
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
    }
    catch (error) {
        next(error);
    }
});
/**
 * Xóa đánh giá
 * DELETE /api/reviews/:id
 */
router.delete('/:id', authMiddleware_1.authenticate, async (req, res, next) => {
    try {
        const reviewId = parseInt(req.params.id || '0');
        const userId = req.user.id;
        const deleted = await reviewRepositoryImpl_1.default.delete(reviewId, userId);
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
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=reviewsRoutes.js.map