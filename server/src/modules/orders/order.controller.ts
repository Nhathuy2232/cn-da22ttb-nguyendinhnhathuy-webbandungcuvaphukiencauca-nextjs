import { Request, Response, NextFunction } from 'express';
import orderService from './order.service';

export class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Vui lòng đăng nhập',
        });
      }

      const { address_id, payment_method, note, shipping_info, shipping_fee, items } = req.body;

      // Nếu có shipping_info (đặt hàng từ cart với GHN)
      if (shipping_info) {
        if (!payment_method) {
          return res.status(400).json({
            success: false,
            message: 'Vui lòng chọn phương thức thanh toán',
          });
        }

        const order = await orderService.checkout({
          userId,
          addressId: address_id || null,
          paymentMethod: payment_method,
          note,
          shipping_info,
          shipping_fee,
          items,
        });

        return res.status(201).json({
          success: true,
          message: 'Đặt hàng thành công',
          data: order,
        });
      }

      // Logic cũ cho trường hợp có address_id
      if (!address_id) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn địa chỉ giao hàng',
        });
      }

      if (!payment_method) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn phương thức thanh toán',
        });
      }

      const order = await orderService.checkout({
        userId,
        addressId: address_id,
        paymentMethod: payment_method,
        note,
      });

      res.status(201).json({
        success: true,
        message: 'Đặt hàng thành công',
        data: order,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Giỏ hàng đang trống') {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      next(error);
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Vui lòng đăng nhập',
        });
      }

      const orders = await orderService.listUserOrders(userId);

      res.json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
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
          message: 'ID đơn hàng không hợp lệ',
        });
      }
      const order = await orderService.getOrderById(parseInt(id), userId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng',
        });
      }

      // Check if order belongs to user
      if (order.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền xem đơn hàng này',
        });
      }

      res.json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID đơn hàng không hợp lệ',
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp trạng thái',
        });
      }

      const validStatuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái không hợp lệ',
        });
      }

      const order = await orderService.updateOrderStatus(parseInt(id), status);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng',
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật trạng thái thành công',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}

const orderController = new OrderController();
export default orderController;
