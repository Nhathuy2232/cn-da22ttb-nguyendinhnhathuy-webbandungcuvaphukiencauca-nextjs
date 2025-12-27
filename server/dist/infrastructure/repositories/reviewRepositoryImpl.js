"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class ReviewRepository {
    /**
     * Tạo đánh giá mới
     */
    async create(data) {
        const [result] = await database_1.default.query(`INSERT INTO product_reviews (product_id, user_id, rating, comment)
       VALUES (?, ?, ?, ?)`, [data.productId, data.userId, data.rating, data.comment || null]);
        const [rows] = await database_1.default.query('SELECT * FROM product_reviews WHERE id = ?', [result.insertId]);
        if (!rows[0]) {
            throw new Error('Failed to create review');
        }
        return rows[0];
    }
    /**
     * Cập nhật đánh giá
     */
    async update(id, userId, data) {
        const updates = [];
        const values = [];
        if (data.rating !== undefined) {
            updates.push('rating = ?');
            values.push(data.rating);
        }
        if (data.comment !== undefined) {
            updates.push('comment = ?');
            values.push(data.comment);
        }
        if (updates.length === 0)
            return false;
        values.push(id, userId);
        const [result] = await database_1.default.query(`UPDATE product_reviews SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`, values);
        return result.affectedRows > 0;
    }
    /**
     * Xóa đánh giá
     */
    async delete(id, userId) {
        const [result] = await database_1.default.query('DELETE FROM product_reviews WHERE id = ? AND user_id = ?', [id, userId]);
        return result.affectedRows > 0;
    }
    /**
     * Lấy danh sách đánh giá của sản phẩm
     */
    async getByProduct(productId, limit = 10, offset = 0) {
        const [rows] = await database_1.default.query(`SELECT 
        r.*,
        u.full_name as user_name
      FROM product_reviews r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?`, [productId, limit, offset]);
        return rows;
    }
    /**
     * Lấy thống kê đánh giá của sản phẩm
     */
    async getProductStats(productId) {
        const [rows] = await database_1.default.query(`SELECT 
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as rating_1,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as rating_2,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as rating_3,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as rating_4,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as rating_5
      FROM product_reviews
      WHERE product_id = ?`, [productId]);
        if (!rows[0]) {
            return {
                average_rating: 0,
                total_reviews: 0,
                rating_1: 0,
                rating_2: 0,
                rating_3: 0,
                rating_4: 0,
                rating_5: 0,
            };
        }
        return rows[0];
    }
    /**
     * Kiểm tra user đã review sản phẩm chưa
     */
    async hasUserReviewed(userId, productId) {
        const [rows] = await database_1.default.query('SELECT id FROM product_reviews WHERE user_id = ? AND product_id = ?', [userId, productId]);
        return rows.length > 0;
    }
    /**
     * Lấy đánh giá của user cho sản phẩm
     */
    async getUserReview(userId, productId) {
        const [rows] = await database_1.default.query('SELECT * FROM product_reviews WHERE user_id = ? AND product_id = ?', [userId, productId]);
        return rows[0] || null;
    }
    /**
     * Lấy tất cả đánh giá của user
     */
    async getByUser(userId) {
        const [rows] = await database_1.default.query(`SELECT r.*, p.name as product_name
       FROM product_reviews r
       INNER JOIN products p ON r.product_id = p.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`, [userId]);
        return rows;
    }
}
exports.default = new ReviewRepository();
//# sourceMappingURL=reviewRepositoryImpl.js.map