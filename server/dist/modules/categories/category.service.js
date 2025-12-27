"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoryRepositoryImpl_1 = __importDefault(require("../../infrastructure/repositories/categoryRepositoryImpl"));
class CategoryService {
    async list() {
        return categoryRepositoryImpl_1.default.list();
    }
    async findById(id) {
        return categoryRepositoryImpl_1.default.findById(id);
    }
    async findByName(name) {
        return categoryRepositoryImpl_1.default.findByName(name);
    }
}
const categoryService = new CategoryService();
exports.default = categoryService;
//# sourceMappingURL=category.service.js.map