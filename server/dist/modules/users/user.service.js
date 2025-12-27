"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRepositoryImpl_1 = __importDefault(require("../../infrastructure/repositories/userRepositoryImpl"));
class UserService {
    list() {
        return userRepositoryImpl_1.default.list();
    }
}
const userService = new UserService();
exports.default = userService;
//# sourceMappingURL=user.service.js.map