"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const wishlistRepositoryImpl_1 = __importDefault(require("../../../infrastructure/repositories/wishlistRepositoryImpl"));
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: API quản lý danh sách yêu thích
 */
/**
 * Lấy danh sách yêu thích của user
 * GET /api/wishlist
 */
router.get('/', authMiddleware_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const items = await wishlistRepositoryImpl_1.default.getByUser(userId);
        res.json({
            success: true,
            data: items,
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Kiểm tra sản phẩm có trong wishlist không
 * GET /api/wishlist/check/:productId
 */
router.get('/check/:productId', authMiddleware_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = parseInt(req.params.productId || '0');
        const inWishlist = await wishlistRepositoryImpl_1.default.isInWishlist(userId, productId);
        res.json({
            success: true,
            data: { in_wishlist: inWishlist },
        });
    }
    catch (error) {
        next(error);
    }
});
/**
 * Thêm sản phẩm vào wishlist
 * POST /api/wishlist
 */
router.post('/', authMiddleware_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.body;
        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin sản phẩm',
            });
        }
        // Kiểm tra đã có trong wishlist chưa
        const exists = await wishlistRepositoryImpl_1.default.isInWishlist(userId, product_id);
        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'Sản phẩm đã có trong danh sách yêu thích',
            });
        }
        const id = await wishlistRepositoryImpl_1.default.addItem(userId, product_id);
        res.status(201).json({
            success: true,
            message: 'Đã thêm vào danh sách yêu thích',
            data: { id },
        });
    }
    catch (error) {
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
 * Xóa sản phẩm khỏi wishlist
 * DELETE /api/wishlist/:productId
 */
router.delete('/:productId', authMiddleware_1.authenticate, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const productId = parseInt(req.params.productId || '0');
        const success = await wishlistRepositoryImpl_1.default.removeItem(userId, productId);
        if (!success) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm trong danh sách yêu thích',
            });
        }
        res.json({
            success: true,
            message: 'Đã xóa khỏi danh sách yêu thích',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=wishlistRoutes.js.map