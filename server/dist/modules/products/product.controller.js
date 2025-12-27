"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = __importDefault(require("./product.service"));
class ProductController {
    async getAll(req, res, next) {
        try {
            const { search, category, page = '1', limit = '20' } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const offset = (pageNum - 1) * limitNum;
            const result = await product_service_1.default.list({
                search: search,
                category: category,
                limit: limitNum,
                offset,
            });
            res.json({
                success: true,
                data: result.items,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / result.limit),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID sản phẩm không hợp lệ',
                });
            }
            const product = await product_service_1.default.findById(parseInt(id));
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sản phẩm',
                });
            }
            res.json({
                success: true,
                data: product,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
const productController = new ProductController();
exports.default = productController;
//# sourceMappingURL=product.controller.js.map