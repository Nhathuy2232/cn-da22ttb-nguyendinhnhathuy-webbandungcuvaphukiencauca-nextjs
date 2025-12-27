"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = __importDefault(require("./category.service"));
class CategoryController {
    async getAll(req, res, next) {
        try {
            const categories = await category_service_1.default.list();
            res.json({
                success: true,
                data: categories,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const category = await category_service_1.default.findById(parseInt(id || '0'));
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy danh mục',
                });
            }
            res.json({
                success: true,
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CategoryController = CategoryController;
const categoryController = new CategoryController();
exports.default = categoryController;
//# sourceMappingURL=category.controller.js.map