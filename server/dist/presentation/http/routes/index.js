"use strict";
/**
 * Index Routes - Tổ chức tất cả các routes của ứng dụng
 * Áp dụng Clean Architecture pattern
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const productsRoutes_1 = __importDefault(require("./productsRoutes"));
const categoriesRoutes_1 = __importDefault(require("./categoriesRoutes"));
const cartRoutes_1 = __importDefault(require("./cartRoutes"));
const ordersRoutes_1 = __importDefault(require("./ordersRoutes"));
const blogsRoutes_1 = __importDefault(require("./blogsRoutes"));
const reviewsRoutes_1 = __importDefault(require("./reviewsRoutes"));
const wishlistRoutes_1 = __importDefault(require("./wishlistRoutes"));
const shippingRoutes_1 = __importDefault(require("./shippingRoutes"));
const flash_salesRoutes_1 = __importDefault(require("./flash-salesRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const router = (0, express_1.Router)();
// Public routes
router.use('/auth', authRoutes_1.default);
router.use('/products', productsRoutes_1.default);
router.use('/categories', categoriesRoutes_1.default);
router.use('/blogs', blogsRoutes_1.default);
router.use('/shipping', shippingRoutes_1.default);
// Protected routes (require authentication)
router.use('/cart', cartRoutes_1.default);
router.use('/orders', ordersRoutes_1.default);
router.use('/reviews', reviewsRoutes_1.default);
router.use('/wishlist', wishlistRoutes_1.default);
router.use('/flash-sales', flash_salesRoutes_1.default);
// Admin routes
router.use('/admin', adminRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map