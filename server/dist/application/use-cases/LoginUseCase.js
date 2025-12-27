"use strict";
/**
 * Use Case: Đăng nhập người dùng
 * Xử lý logic nghiệp vụ cho việc đăng nhập
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginUseCase {
    userRepository;
    jwtSecret;
    jwtExpiresIn;
    constructor(userRepository, jwtSecret, jwtExpiresIn) {
        this.userRepository = userRepository;
        this.jwtSecret = jwtSecret;
        this.jwtExpiresIn = jwtExpiresIn;
    }
    async execute(dto) {
        // Tìm người dùng theo email
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new Error('Thông tin đăng nhập không chính xác');
        }
        // Kiểm tra mật khẩu
        const isPasswordValid = await bcryptjs_1.default.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Thông tin đăng nhập không chính xác');
        }
        // Tạo JWT token
        const payload = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        };
        const options = {};
        if (this.jwtExpiresIn) {
            options.expiresIn = this.jwtExpiresIn;
        }
        const accessToken = jsonwebtoken_1.default.sign(payload, this.jwtSecret, options);
        return {
            accessToken,
            user: payload,
        };
    }
}
exports.LoginUseCase = LoginUseCase;
//# sourceMappingURL=LoginUseCase.js.map