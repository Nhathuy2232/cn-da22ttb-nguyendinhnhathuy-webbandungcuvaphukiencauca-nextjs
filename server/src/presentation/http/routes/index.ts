/**
 * Index Routes - Tổ chức tất cả các routes của ứng dụng
 * Áp dụng Clean Architecture pattern
 */

import { Router } from 'express';
import authRoutes from './authRoutes';
import productsRoutes from './productsRoutes';
import categoriesRoutes from './categoriesRoutes';
import cartRoutes from './cartRoutes';
import ordersRoutes from './ordersRoutes';
import blogsRoutes from './blogsRoutes';
import reviewsRoutes from './reviewsRoutes';
import wishlistRoutes from './wishlistRoutes';
import shippingRoutes from './shippingRoutes';
import flashSalesRoutes from './flash-salesRoutes';
import couponsRoutes from './couponsRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

// Public routes
router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/blogs', blogsRoutes);
router.use('/shipping', shippingRoutes);
router.use('/coupons', couponsRoutes);

// Protected routes (require authentication)
router.use('/cart', cartRoutes);
router.use('/orders', ordersRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/flash-sales', flashSalesRoutes);

// Admin routes
router.use('/admin', adminRoutes);

export default router;
