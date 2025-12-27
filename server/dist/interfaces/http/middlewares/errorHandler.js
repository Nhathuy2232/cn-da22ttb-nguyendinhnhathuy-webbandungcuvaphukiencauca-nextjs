"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../../../config/logger"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, _req, res, _next) => {
    logger_1.default.error({ err }, 'Unhandled error');
    const unauthMessages = ['Unauthorized', 'Chưa đăng nhập'];
    const status = unauthMessages.includes(err.message) ? 401 : 400;
    res.status(status).json({ message: err.message });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (_req, res) => {
    res.status(404).json({ message: 'Không tìm thấy đường dẫn' });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map