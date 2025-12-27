"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = __importDefault(require("./auth.service"));
class AuthController {
    async register(req, res, next) {
        try {
            const { full_name, email, password, phone } = req.body;
            // Validation
            if (!full_name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin',
                });
            }
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                });
            }
            const result = await auth_service_1.default.register({
                fullName: full_name,
                email,
                password,
            });
            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công',
                data: {
                    user: result.user,
                    accessToken: result.tokens.accessToken,
                },
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Email đã được đăng ký') {
                return res.status(409).json({
                    success: false,
                    message: error.message,
                });
            }
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin',
                });
            }
            const result = await auth_service_1.default.login({ email, password });
            res.json({
                success: true,
                message: 'Đăng nhập thành công',
                data: {
                    user: result.user,
                    accessToken: result.tokens.accessToken,
                },
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Thông tin đăng nhập không chính xác') {
                return res.status(401).json({
                    success: false,
                    message: error.message,
                });
            }
            next(error);
        }
    }
    async getMe(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'Vui lòng đăng nhập',
                });
            }
            const user = await auth_service_1.default.me(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy người dùng',
                });
            }
            res.json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            // JWT is stateless, so logout is handled on client side
            // Just return success message
            res.json({
                success: true,
                message: 'Đăng xuất thành công',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
const authController = new AuthController();
exports.default = authController;
//# sourceMappingURL=auth.controller.js.map