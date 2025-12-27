"use strict";
/**
 * Index file - Export tất cả các repositories
 * Sử dụng để import dễ dàng hơn
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flashSaleRepository = exports.couponRepository = exports.wishlistRepository = exports.reviewRepository = exports.blogRepository = exports.categoryRepository = exports.cartRepository = exports.orderRepository = exports.productRepository = exports.userRepository = void 0;
var userRepositoryImpl_1 = require("./userRepositoryImpl");
Object.defineProperty(exports, "userRepository", { enumerable: true, get: function () { return __importDefault(userRepositoryImpl_1).default; } });
var productRepositoryImpl_1 = require("./productRepositoryImpl");
Object.defineProperty(exports, "productRepository", { enumerable: true, get: function () { return __importDefault(productRepositoryImpl_1).default; } });
var orderRepositoryImpl_1 = require("./orderRepositoryImpl");
Object.defineProperty(exports, "orderRepository", { enumerable: true, get: function () { return __importDefault(orderRepositoryImpl_1).default; } });
var cartRepositoryImpl_1 = require("./cartRepositoryImpl");
Object.defineProperty(exports, "cartRepository", { enumerable: true, get: function () { return __importDefault(cartRepositoryImpl_1).default; } });
var categoryRepositoryImpl_1 = require("./categoryRepositoryImpl");
Object.defineProperty(exports, "categoryRepository", { enumerable: true, get: function () { return __importDefault(categoryRepositoryImpl_1).default; } });
var blogRepositoryImpl_1 = require("./blogRepositoryImpl");
Object.defineProperty(exports, "blogRepository", { enumerable: true, get: function () { return __importDefault(blogRepositoryImpl_1).default; } });
var reviewRepositoryImpl_1 = require("./reviewRepositoryImpl");
Object.defineProperty(exports, "reviewRepository", { enumerable: true, get: function () { return __importDefault(reviewRepositoryImpl_1).default; } });
var wishlistRepositoryImpl_1 = require("./wishlistRepositoryImpl");
Object.defineProperty(exports, "wishlistRepository", { enumerable: true, get: function () { return __importDefault(wishlistRepositoryImpl_1).default; } });
var couponRepositoryImpl_1 = require("./couponRepositoryImpl");
Object.defineProperty(exports, "couponRepository", { enumerable: true, get: function () { return __importDefault(couponRepositoryImpl_1).default; } });
var flashSaleRepositoryImpl_1 = require("./flashSaleRepositoryImpl");
Object.defineProperty(exports, "flashSaleRepository", { enumerable: true, get: function () { return __importDefault(flashSaleRepositoryImpl_1).default; } });
//# sourceMappingURL=index.js.map