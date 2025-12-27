import { Router } from 'express';
import authRoutes from '../../../api/auth';
import productRoutes from '../../../api/products';
import categoryRoutes from '../../../api/categories';
import cartRoutes from '../../../api/cart';
import orderRoutes from '../../../api/orders';
import adminRoutes from '../../../api/admin';
import blogRoutes from '../../../api/blogs';
import shippingRoutes from '../../../api/shipping';
import reviewRoutes from '../../../api/reviews';
import wishlistRoutes from '../../../api/wishlist';
import flashSaleRoutes from '../../../api/flash-sales';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/blogs', blogRoutes);
router.use('/shipping', shippingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/flash-sales', flashSaleRoutes);

export default router;
