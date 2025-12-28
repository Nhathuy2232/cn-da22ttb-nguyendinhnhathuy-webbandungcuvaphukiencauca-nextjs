"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = __importDefault(require("./cart.service"));
class CartController {
    async getCart(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Vui lòng đăng nhập',
                });
            }
            const items = await cart_service_1.default.getCart(userId);
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
        }
        catch (error) {
            next(error);
        }
    }
    async addItem(req, res, next) {
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
            const items = await cart_service_1.default.addItem(userId, product_id, quantity);
            res.json({
                success: true,
                message: 'Đã thêm sản phẩm vào giỏ hàng',
                data: items,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateItem(req, res, next) {
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
            await cart_service_1.default.updateItem(userId, itemId, quantity);
            const items = await cart_service_1.default.getCart(userId);
            res.json({
                success: true,
                message: 'Đã cập nhật giỏ hàng',
                data: items,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async removeItem(req, res, next) {
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
            const items = await cart_service_1.default.removeItem(userId, parseInt(id));
            res.json({
                success: true,
                message: 'Đã xóa sản phẩm khỏi giỏ hàng',
                data: items,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async clearCart(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Vui lòng đăng nhập',
                });
            }
            await cart_service_1.default.clear(userId);
            res.json({
                success: true,
                message: 'Đã xóa toàn bộ giỏ hàng',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CartController = CartController;
const cartController = new CartController();
exports.default = cartController;
//# sourceMappingURL=cart.controller.js.map