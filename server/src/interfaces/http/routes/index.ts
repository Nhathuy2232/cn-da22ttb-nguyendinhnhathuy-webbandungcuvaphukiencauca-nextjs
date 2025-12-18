import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';
import userRoutes from './userRoutes';
import wishlistRoutes from './wishlistRoutes';
import reviewRoutes from './reviewRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/reviews', reviewRoutes);

export default router;

