"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class FlashSaleRepository {
    async create(data) {
        const [result] = await database_1.default.query(`INSERT INTO flash_sales (product_id, discount_percentage, start_time, end_time, status)
       VALUES (?, ?, ?, ?, ?)`, [
            data.product_id,
            data.discount_percentage,
            data.start_time,
            data.end_time,
            data.status || 'active',
        ]);
        const [rows] = await database_1.default.query('SELECT * FROM flash_sales WHERE id = ?', [result.insertId]);
        return rows[0];
    }
    async findById(id) {
        const [rows] = await database_1.default.query('SELECT * FROM flash_sales WHERE id = ?', [id]);
        return rows.length ? rows[0] : null;
    }
    async findByProductId(productId) {
        const [rows] = await database_1.default.query('SELECT * FROM flash_sales WHERE product_id = ? AND status = "active" ORDER BY created_at DESC LIMIT 1', [productId]);
        return rows.length ? rows[0] : null;
    }
    async listActive() {
        const [rows] = await database_1.default.query(`SELECT 
        fs.*,
        p.name as product_name,
        p.price as product_price,
        pi.image_url as product_thumbnail,
        ROUND(p.price * (100 - fs.discount_percentage) / 100, 0) as discounted_price
       FROM flash_sales fs
       INNER JOIN products p ON fs.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
       WHERE fs.status = 'active' 
       AND fs.start_time <= NOW() 
       AND fs.end_time > NOW()
       ORDER BY fs.created_at DESC`);
        return rows;
    }
    async listAll(filter) {
        const limit = filter?.limit ?? 20;
        const offset = filter?.offset ?? 0;
        const whereClause = filter?.status ? `WHERE fs.status = ?` : '';
        const params = filter?.status ? [filter.status, limit, offset] : [limit, offset];
        const [rows] = await database_1.default.query(`SELECT 
        fs.*,
        p.name as product_name,
        p.price as product_price,
        p.thumbnail_url as product_thumbnail,
        ROUND(p.price * (100 - fs.discount_percentage) / 100, 0) as discounted_price
       FROM flash_sales fs
       INNER JOIN products p ON fs.product_id = p.id
       ${whereClause}
       ORDER BY fs.created_at DESC
       LIMIT ? OFFSET ?`, params);
        const [countRows] = await database_1.default.query(`SELECT COUNT(*) as total FROM flash_sales fs ${whereClause}`, filter?.status ? [filter.status] : []);
        return {
            items: rows,
            total: Number(countRows[0]?.total ?? 0),
        };
    }
    async update(id, data) {
        const updates = [];
        const values = [];
        if (data.discount_percentage !== undefined) {
            updates.push('discount_percentage = ?');
            values.push(data.discount_percentage);
        }
        if (data.start_time !== undefined) {
            updates.push('start_time = ?');
            values.push(data.start_time);
        }
        if (data.end_time !== undefined) {
            updates.push('end_time = ?');
            values.push(data.end_time);
        }
        if (data.status !== undefined) {
            updates.push('status = ?');
            values.push(data.status);
        }
        if (updates.length === 0) {
            return this.findById(id);
        }
        values.push(id);
        await database_1.default.query(`UPDATE flash_sales SET ${updates.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    }
    async delete(id) {
        const [result] = await database_1.default.query('DELETE FROM flash_sales WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    async deleteByProductId(productId) {
        const [result] = await database_1.default.query('DELETE FROM flash_sales WHERE product_id = ?', [productId]);
        return result.affectedRows > 0;
    }
}
exports.default = new FlashSaleRepository();
//# sourceMappingURL=flashSaleRepositoryImpl.js.map