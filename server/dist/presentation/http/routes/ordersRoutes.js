"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("../../../modules/orders/order.controller"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.post('/', order_controller_1.default.createOrder.bind(order_controller_1.default));
router.post('/confirm-payment', order_controller_1.default.confirmPayment.bind(order_controller_1.default));
router.get('/', order_controller_1.default.getOrders.bind(order_controller_1.default));
router.get('/:id', order_controller_1.default.getOrderById.bind(order_controller_1.default));
router.patch('/:id/status', (0, authMiddleware_1.authorize)(['admin']), order_controller_1.default.updateOrderStatus.bind(order_controller_1.default));
exports.default = router;
//# sourceMappingURL=ordersRoutes.js.map