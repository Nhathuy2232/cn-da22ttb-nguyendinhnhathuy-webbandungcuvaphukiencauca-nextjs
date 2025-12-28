import { Request, Response, NextFunction } from 'express';
import cartService from './cart.service';

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Vui lòng đăng nhập',
        });
      }

      const items = await cartService.getCart(userId);
      
      // Map to frontend format
      const mappedItems = items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product_name: item.product_name || '',
        product_price: item.price || 0,
        product_thumbnail: item.product_thumbnail || '/images/products/placeholder.jpg',
        stock_quantity: item.stock_quantity || 0,
      }));
      
      // Calculate total
      const total = mappedItems.reduce((sum, item) => {
        return sum + item.product_price * item.quantity;
      }, 0);

      res.json({
        success: true,
        data: {
          items: mappedItems,
          total,
          count: mappedItems.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Vui lòng đăng nhập',
        });
      }

      const { product_id, quantity = 1 } = req.body;

      if (!product_id) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin sản phẩm',
        });
      }

      const items = await cartService.addItem(userId, product_id, quantity);
      
      res.json({
        success: true,
        message: 'Đã thêm sản phẩm vào giỏ hàng',
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Vui lòng đăng nhập',
        });
      }

      const { itemId, quantity } = req.body;

      if (!itemId) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin itemId',
        });
      }
      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng không hợp lệ',
        });
      }
      await cartService.updateItem(userId, itemId, quantity);
      const items = await cartService.getCart(userId);
      res.json({
        success: true,
        message: 'Đã cập nhật giỏ hàng',
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Vui lòng đăng nhập',
        });
      }

      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID không hợp lệ',
        });
      }
      const items = await cartService.removeItem(userId, parseInt(id));
      
      res.json({
        success: true,
        message: 'Đã xóa sản phẩm khỏi giỏ hàng',
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Vui lòng đăng nhập',
        });
      }

      await cartService.clear(userId);
      
      res.json({
        success: true,
        message: 'Đã xóa toàn bộ giỏ hàng',
      });
    } catch (error) {
      next(error);
    }
  }
}

const cartController = new CartController();
export default cartController;
