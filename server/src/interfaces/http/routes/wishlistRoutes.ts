import { Router, Request, Response, NextFunction } from 'express';
import wishlistRepository from '../../infrastructure/repositories/wishlistRepository';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: API quản lý danh sách yêu thích
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Lấy danh sách yêu thích của user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm yêu thích
 */
router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập',
      });
    }

    const items = await wishlistRepository.getByUser(userId);
    
    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     tags: [Wishlist]
 *     summary: Thêm sản phẩm vào wishlist
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
 *             properties:
 *               product_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Thêm vào wishlist thành công
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

    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin sản phẩm',
      });
    }

    // Kiểm tra đã có trong wishlist chưa
    const exists = await wishlistRepository.isInWishlist(userId, product_id);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Sản phẩm đã có trong danh sách yêu thích',
      });
    }

    const id = await wishlistRepository.addItem(userId, product_id);

    res.status(201).json({
      success: true,
      message: 'Đã thêm vào danh sách yêu thích',
      data: { id },
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
 * /api/wishlist/{productId}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Xóa sản phẩm khỏi wishlist
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
 *         description: Xóa khỏi wishlist thành công
 */
router.delete('/:productId', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập',
      });
    }

    const productId = parseInt(req.params.productId);
    
    const success = await wishlistRepository.removeItem(userId, productId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không có trong danh sách yêu thích',
      });
    }

    res.json({
      success: true,
      message: 'Đã xóa khỏi danh sách yêu thích',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/wishlist/check/{productId}:
 *   get:
 *     tags: [Wishlist]
 *     summary: Kiểm tra sản phẩm có trong wishlist không
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
 *         description: Kết quả kiểm tra
 */
router.get('/check/:productId', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập',
      });
    }

    const productId = parseInt(req.params.productId);
    const inWishlist = await wishlistRepository.isInWishlist(userId, productId);

    res.json({
      success: true,
      data: { in_wishlist: inWishlist },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
