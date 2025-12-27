"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Chưa đăng nhập' });
    }
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Không có quyền truy cập. Chỉ dành cho Admin' });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=adminMiddleware.js.map