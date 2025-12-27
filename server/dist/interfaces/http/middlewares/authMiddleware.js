"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../../config/env"));
const authenticate = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ message: 'Thiếu thông tin xác thực' });
    }
    const [, token] = header.split(' ');
    if (!token) {
        return res.status(401).json({ message: 'Header xác thực không hợp lệ' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.default.jwt.secret);
        req.user = payload;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};
exports.authenticate = authenticate;
const authorize = (roles = ['customer', 'admin']) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Chưa đăng nhập' });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Không đủ quyền truy cập' });
    }
    next();
};
exports.authorize = authorize;
//# sourceMappingURL=authMiddleware.js.map