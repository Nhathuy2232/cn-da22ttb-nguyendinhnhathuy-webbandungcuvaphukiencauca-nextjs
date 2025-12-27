"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../config/env"));
const userRepositoryImpl_1 = __importDefault(require("../../infrastructure/repositories/userRepositoryImpl"));
class AuthService {
    toUserPayload(user) {
        return {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            role: user.role,
        };
    }
    generateToken(user) {
        const payload = this.toUserPayload(user);
        const options = {};
        if (env_1.default.jwt.expiresIn) {
            options.expiresIn = env_1.default.jwt.expiresIn;
        }
        const accessToken = jsonwebtoken_1.default.sign(payload, env_1.default.jwt.secret, options);
        return { accessToken };
    }
    async register(input) {
        const existing = await userRepositoryImpl_1.default.findByEmail(input.email);
        if (existing) {
            throw new Error('Email đã được đăng ký');
        }
        const passwordHash = await bcryptjs_1.default.hash(input.password, 10);
        const user = await userRepositoryImpl_1.default.create({
            fullName: input.fullName,
            email: input.email,
            passwordHash,
        });
        return { user: this.toUserPayload(user), tokens: this.generateToken(user) };
    }
    async login(input) {
        const user = await userRepositoryImpl_1.default.findByEmail(input.email);
        if (!user) {
            throw new Error('Thông tin đăng nhập không chính xác');
        }
        const isMatch = await bcryptjs_1.default.compare(input.password, user.password_hash);
        if (!isMatch) {
            throw new Error('Thông tin đăng nhập không chính xác');
        }
        return { user: this.toUserPayload(user), tokens: this.generateToken(user) };
    }
    async me(id) {
        const user = await userRepositoryImpl_1.default.findById(id);
        return user ? this.toUserPayload(user) : null;
    }
}
const authService = new AuthService();
exports.default = authService;
//# sourceMappingURL=auth.service.js.map