"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flashSaleRepositoryImpl_1 = __importDefault(require("../../infrastructure/repositories/flashSaleRepositoryImpl"));
const productRepositoryImpl_1 = __importDefault(require("../../infrastructure/repositories/productRepositoryImpl"));
class FlashSaleService {
    async createFlashSale(data) {
        // Kiểm tra sản phẩm tồn tại
        const product = await productRepositoryImpl_1.default.findById(data.product_id);
        if (!product) {
            throw new Error('Không tìm thấy sản phẩm');
        }
        // Kiểm tra giá trị giảm giá
        if (data.discount_percentage <= 0 || data.discount_percentage > 100) {
            throw new Error('Phần trăm giảm giá phải từ 1 đến 100');
        }
        // Kiểm tra thời gian
        const startTime = new Date(data.start_time);
        const endTime = new Date(data.end_time);
        if (startTime >= endTime) {
            throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu');
        }
        // Kiểm tra xem sản phẩm đã có flash sale active chưa
        const existingFlashSale = await flashSaleRepositoryImpl_1.default.findByProductId(data.product_id);
        if (existingFlashSale) {
            throw new Error('Sản phẩm này đã có chương trình flash sale đang hoạt động');
        }
        return flashSaleRepositoryImpl_1.default.create({
            product_id: data.product_id,
            discount_percentage: data.discount_percentage,
            start_time: startTime,
            end_time: endTime,
            status: data.status || 'active',
        });
    }
    async getActiveFlashSales() {
        return flashSaleRepositoryImpl_1.default.listActive();
    }
    async getAllFlashSales(filter) {
        return flashSaleRepositoryImpl_1.default.listAll(filter);
    }
    async getFlashSaleById(id) {
        const flashSale = await flashSaleRepositoryImpl_1.default.findById(id);
        if (!flashSale) {
            throw new Error('Không tìm thấy flash sale');
        }
        return flashSale;
    }
    async updateFlashSale(id, data) {
        const flashSale = await flashSaleRepositoryImpl_1.default.findById(id);
        if (!flashSale) {
            throw new Error('Không tìm thấy flash sale');
        }
        // Kiểm tra giá trị giảm giá
        if (data.discount_percentage !== undefined) {
            if (data.discount_percentage <= 0 || data.discount_percentage > 100) {
                throw new Error('Phần trăm giảm giá phải từ 1 đến 100');
            }
        }
        // Kiểm tra thời gian
        if (data.start_time || data.end_time) {
            const startTime = data.start_time ? new Date(data.start_time) : flashSale.start_time;
            const endTime = data.end_time ? new Date(data.end_time) : flashSale.end_time;
            if (startTime >= endTime) {
                throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu');
            }
        }
        const updateData = {};
        if (data.discount_percentage !== undefined)
            updateData.discount_percentage = data.discount_percentage;
        if (data.start_time)
            updateData.start_time = new Date(data.start_time);
        if (data.end_time)
            updateData.end_time = new Date(data.end_time);
        if (data.status)
            updateData.status = data.status;
        return flashSaleRepositoryImpl_1.default.update(id, updateData);
    }
    async deleteFlashSale(id) {
        const flashSale = await flashSaleRepositoryImpl_1.default.findById(id);
        if (!flashSale) {
            throw new Error('Không tìm thấy flash sale');
        }
        const deleted = await flashSaleRepositoryImpl_1.default.delete(id);
        if (!deleted) {
            throw new Error('Không thể xóa flash sale');
        }
        return { message: 'Xóa flash sale thành công' };
    }
}
exports.default = new FlashSaleService();
//# sourceMappingURL=flash-sale.service.js.map