import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../interfaces/http/middlewares/authMiddleware';
import wishlistRepository from '../infrastructure/repositories/wishlistRepository';

const router = Router();

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
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
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
 * Kiểm tra sản phẩm có trong wishlist không
 * GET /api/wishlist/check/:productId
 */
router.get('/check/:productId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
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

/**
 * Thêm sản phẩm vào wishlist
 * POST /api/wishlist
 */
router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
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
 * Xóa sản phẩm khỏi wishlist
 * DELETE /api/wishlist/:productId
 */
router.delete('/:productId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const productId = parseInt(req.params.productId);
    
    const success = await wishlistRepository.removeItem(userId, productId);

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
  } catch (error) {
    next(error);
  }
});

export default router;
