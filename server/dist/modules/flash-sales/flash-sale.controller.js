"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashSaleController = void 0;
const flash_sale_service_1 = __importDefault(require("./flash-sale.service"));
class FlashSaleController {
    async createFlashSale(req, res, next) {
        try {
            const { product_id, discount_percentage, start_time, end_time, status } = req.body;
            if (!product_id || !discount_percentage || !start_time || !end_time) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp đầy đủ thông tin',
                });
            }
            const flashSale = await flash_sale_service_1.default.createFlashSale({
                product_id,
                discount_percentage,
                start_time,
                end_time,
                status,
            });
            res.status(201).json({
                success: true,
                message: 'Tạo flash sale thành công',
                data: flashSale,
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
    async getActiveFlashSales(req, res, next) {
        try {
            const flashSales = await flash_sale_service_1.default.getActiveFlashSales();
            res.json({
                success: true,
                data: flashSales,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAllFlashSales(req, res, next) {
        try {
            const { status, limit, offset } = req.query;
            const filterOptions = {};
            if (status)
                filterOptions.status = status;
            if (limit)
                filterOptions.limit = Number(limit);
            if (offset)
                filterOptions.offset = Number(offset);
            const result = await flash_sale_service_1.default.getAllFlashSales(filterOptions);
            res.json({
                success: true,
                data: result.items,
                pagination: {
                    total: result.total,
                    limit: limit ? Number(limit) : 20,
                    offset: offset ? Number(offset) : 0,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getFlashSaleById(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID không hợp lệ',
                });
            }
            const flashSale = await flash_sale_service_1.default.getFlashSaleById(Number(id));
            res.json({
                success: true,
                data: flashSale,
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Không tìm thấy flash sale') {
                return res.status(404).json({
                    success: false,
                    message: error.message,
                });
            }
            next(error);
        }
    }
    async updateFlashSale(req, res, next) {
        try {
            const { id } = req.params;
            const { discount_percentage, start_time, end_time, status } = req.body;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID không hợp lệ',
                });
            }
            const flashSale = await flash_sale_service_1.default.updateFlashSale(Number(id), {
                discount_percentage,
                start_time,
                end_time,
                status,
            });
            res.json({
                success: true,
                message: 'Cập nhật flash sale thành công',
                data: flashSale,
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
    async deleteFlashSale(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID không hợp lệ',
                });
            }
            const result = await flash_sale_service_1.default.deleteFlashSale(Number(id));
            res.json({
                success: true,
                message: result.message,
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
exports.FlashSaleController = FlashSaleController;
exports.default = new FlashSaleController();
//# sourceMappingURL=flash-sale.controller.js.map