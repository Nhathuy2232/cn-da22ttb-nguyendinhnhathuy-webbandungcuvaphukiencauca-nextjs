"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cartRepositoryImpl_1 = __importDefault(require("../../infrastructure/repositories/cartRepositoryImpl"));
const productRepositoryImpl_1 = __importDefault(require("../../infrastructure/repositories/productRepositoryImpl"));
class CartService {
    getCart(userId) {
        return cartRepositoryImpl_1.default.getItemsByUser(userId);
    }
    async addItem(userId, productId, quantity) {
        if (quantity <= 0) {
            throw new Error('Số lượng phải lớn hơn 0');
        }
        const product = await productRepositoryImpl_1.default.findById(productId);
        if (!product) {
            throw new Error('Không tìm thấy sản phẩm');
        }
        if (product.stock_quantity < quantity) {
            throw new Error('Số lượng tồn kho không đủ');
        }
        return cartRepositoryImpl_1.default.addItem(userId, productId, quantity);
    }
    async updateItem(userId, itemId, quantity) {
        if (quantity <= 0) {
            throw new Error('Số lượng phải lớn hơn 0');
        }
        return cartRepositoryImpl_1.default.updateItem(itemId, userId, quantity);
    }
    removeItem(userId, itemId) {
        return cartRepositoryImpl_1.default.removeItem(itemId, userId);
    }
    clear(userId) {
        return cartRepositoryImpl_1.default.clear(userId);
    }
}
const cartService = new CartService();
exports.default = cartService;
//# sourceMappingURL=cart.service.js.map