"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = __importDefault(require("../../../modules/cart/cart.controller"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.get('/', cart_controller_1.default.getCart.bind(cart_controller_1.default));
router.post('/', cart_controller_1.default.addItem.bind(cart_controller_1.default));
router.put('/', cart_controller_1.default.updateItem.bind(cart_controller_1.default));
router.delete('/:id', cart_controller_1.default.removeItem.bind(cart_controller_1.default));
router.delete('/', cart_controller_1.default.clearCart.bind(cart_controller_1.default));
exports.default = router;
//# sourceMappingURL=cartRoutes.js.map