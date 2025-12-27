"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class WishlistRepository {
    /**
     * Thêm sản phẩm vào wishlist
     */
    async addItem(userId, productId) {
        const [result] = await database_1.default.query('INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)', [userId, productId]);
        return result.insertId;
    }
    /**
     * Xóa sản phẩm khỏi wishlist
     */
    async removeItem(userId, productId) {
        const [result] = await database_1.default.query('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?', [userId, productId]);
        return result.affectedRows > 0;
    }
    /**
     * Lấy danh sách wishlist của user
     */
    async getByUser(userId) {
        const [rows] = await database_1.default.query(`SELECT 
        w.id,
        w.user_id,
        w.product_id,
        w.created_at,
        p.name as product_name,
        p.price,
        p.thumbnail_url,
        p.stock_quantity
      FROM wishlists w
      INNER JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC`, [userId]);
        return rows;
    }
    /**
     * Kiểm tra sản phẩm có trong wishlist không
     */
    async isInWishlist(userId, productId) {
        const [rows] = await database_1.default.query('SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?', [userId, productId]);
        return rows.length > 0;
    }
    /**
     * Xóa toàn bộ wishlist của user
     */
    async clearUserWishlist(userId) {
        const [result] = await database_1.default.query('DELETE FROM wishlists WHERE user_id = ?', [userId]);
        return result.affectedRows > 0;
    }
    /**
     * Đếm số sản phẩm trong wishlist
     */
    async countByUser(userId) {
        const [rows] = await database_1.default.query('SELECT COUNT(*) as count FROM wishlists WHERE user_id = ?', [userId]);
        return rows[0]?.count ?? 0;
    }
}
exports.default = new WishlistRepository();
//# sourceMappingURL=wishlistRepositoryImpl.js.map