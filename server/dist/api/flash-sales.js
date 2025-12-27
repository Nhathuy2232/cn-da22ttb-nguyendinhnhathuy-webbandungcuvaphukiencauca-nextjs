"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const flash_sale_controller_1 = __importDefault(require("../modules/flash-sales/flash-sale.controller"));
const authMiddleware_1 = require("../interfaces/http/middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/active', flash_sale_controller_1.default.getActiveFlashSales.bind(flash_sale_controller_1.default));
// Admin routes
router.use(authMiddleware_1.authenticate);
router.use((0, authMiddleware_1.authorize)(['admin']));
router.post('/', flash_sale_controller_1.default.createFlashSale.bind(flash_sale_controller_1.default));
router.get('/', flash_sale_controller_1.default.getAllFlashSales.bind(flash_sale_controller_1.default));
router.get('/:id', flash_sale_controller_1.default.getFlashSaleById.bind(flash_sale_controller_1.default));
router.patch('/:id', flash_sale_controller_1.default.updateFlashSale.bind(flash_sale_controller_1.default));
router.delete('/:id', flash_sale_controller_1.default.deleteFlashSale.bind(flash_sale_controller_1.default));
exports.default = router;
//# sourceMappingURL=flash-sales.js.map