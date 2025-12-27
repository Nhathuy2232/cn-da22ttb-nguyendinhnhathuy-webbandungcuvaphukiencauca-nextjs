"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = __importDefault(require("./order.service"));
class OrderController {
    async createOrder(req, res, next) {
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
                const order = await order_service_1.default.checkout({
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
            // Logic cũ cho trường hợp có address_id (deprecated - nên dùng shipping_info)
            // Giữ lại để tương thích ngược, nhưng khuyến khích dùng shipping_info từ GHN API
            if (!address_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp shipping_info hoặc address_id. Khuyến nghị sử dụng shipping_info từ GHN API.',
                });
            }
            if (!payment_method) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng chọn phương thức thanh toán',
                });
            }
            const order = await order_service_1.default.checkout({
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
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Giỏ hàng đang trống') {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            next(error);
        }
    }
    async getOrders(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Vui lòng đăng nhập',
                });
            }
            const orders = await order_service_1.default.listUserOrders(userId);
            res.json({
                success: true,
                data: orders,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getOrderById(req, res, next) {
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
            const order = await order_service_1.default.getOrderById(parseInt(id), userId);
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
        }
        catch (error) {
            next(error);
        }
    }
    async updateOrderStatus(req, res, next) {
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
            const order = await order_service_1.default.updateOrderStatus(parseInt(id), status);
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
        }
        catch (error) {
            next(error);
        }
    }
    async confirmPayment(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Vui lòng đăng nhập',
                });
            }
            const { order_id } = req.body;
            if (!order_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp ID đơn hàng',
                });
            }
            const result = await order_service_1.default.confirmPayment(parseInt(order_id), userId);
            res.json({
                success: true,
                message: 'Xác nhận thanh toán thành công',
                data: result,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }
            next(error);
        }
    }
}
exports.OrderController = OrderController;
const orderController = new OrderController();
exports.default = orderController;
//# sourceMappingURL=order.controller.js.map