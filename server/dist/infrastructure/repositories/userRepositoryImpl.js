"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class UserRepository {
    async findByEmail(email) {
        const [rows] = await database_1.default.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
        if (!rows.length) {
            return null;
        }
        return rows[0];
    }
    async findById(id) {
        const [rows] = await database_1.default.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) {
            return null;
        }
        return rows[0];
    }
    async create(data) {
        const payload = {
            full_name: data.fullName,
            email: data.email,
            password_hash: data.passwordHash,
            role: data.role ?? 'customer',
        };
        const [result] = await database_1.default.query('INSERT INTO users (full_name, email, password_hash, role) VALUES (:full_name, :email, :password_hash, :role)', payload);
        const inserted = await this.findById(result.insertId);
        if (!inserted) {
            throw new Error('Unable to fetch inserted user');
        }
        return inserted;
    }
    async list() {
        const [rows] = await database_1.default.query('SELECT * FROM users ORDER BY created_at DESC');
        return rows;
    }
}
const userRepository = new UserRepository();
exports.default = userRepository;
//# sourceMappingURL=userRepositoryImpl.js.map