"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = __importDefault(require("../../config/env"));
const productRepositoryImpl_1 = __importDefault(require("../../infrastructure/repositories/productRepositoryImpl"));
class ProductService {
    async list(filter = {}) {
        const limit = filter.limit ?? env_1.default.pagination.defaultLimit;
        const page = filter.offset ? Math.floor(filter.offset / limit) + 1 : 1;
        const result = await productRepositoryImpl_1.default.list({ ...filter, limit });
        return { ...result, limit, page };
    }
    async findById(id) {
        return productRepositoryImpl_1.default.findById(id);
    }
    async create(data) {
        return productRepositoryImpl_1.default.create(data);
    }
    async update(id, data) {
        return productRepositoryImpl_1.default.update(id, data);
    }
    async delete(id) {
        await productRepositoryImpl_1.default.delete(id);
    }
}
const productService = new ProductService();
exports.default = productService;
//# sourceMappingURL=product.service.js.map