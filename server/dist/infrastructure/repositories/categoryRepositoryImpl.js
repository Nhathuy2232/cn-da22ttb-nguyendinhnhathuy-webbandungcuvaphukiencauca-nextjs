"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class CategoryRepository {
    async list() {
        const [rows] = await database_1.default.query('SELECT * FROM categories ORDER BY name ASC');
        return rows;
    }
    async findById(id) {
        const [rows] = await database_1.default.query('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);
        if (!rows.length) {
            return null;
        }
        return rows[0];
    }
    async findByName(name) {
        const [rows] = await database_1.default.query('SELECT * FROM categories WHERE name = ? LIMIT 1', [name]);
        if (!rows.length) {
            return null;
        }
        return rows[0];
    }
    async create(data) {
        const [result] = await database_1.default.query('INSERT INTO categories (name, description) VALUES (?, ?)', [data.name, data.description || null]);
        return result.insertId;
    }
    async update(id, data) {
        const [result] = await database_1.default.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [data.name, data.description, id]);
        return result.affectedRows > 0;
    }
    async delete(id) {
        const [result] = await database_1.default.query('DELETE FROM categories WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}
const categoryRepository = new CategoryRepository();
exports.default = categoryRepository;
//# sourceMappingURL=categoryRepositoryImpl.js.map