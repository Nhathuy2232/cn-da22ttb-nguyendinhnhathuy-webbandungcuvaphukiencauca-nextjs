"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class CartRepository {
    async getOrCreateCart(userId) {
        // Try to get existing cart
        const [rows] = await database_1.default.query('SELECT * FROM carts WHERE user_id = ? LIMIT 1', [userId]);
        if (rows.length > 0) {
            return rows[0];
        }
        // Create new cart if doesn't exist
        const [result] = await database_1.default.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
        const [newRows] = await database_1.default.query('SELECT * FROM carts WHERE id = ?', [result.insertId]);
        return newRows[0];
    }
    async getItemsByUser(userId) {
        const cart = await this.getOrCreateCart(userId);
        const [rows] = await database_1.default.query(`SELECT ci.*, p.name as product_name, 
       COALESCE(fs.discounted_price, p.price) as price, 
       p.stock_quantity,
       COALESCE(pi.image_url, '/images/products/placeholder.jpg') as product_thumbnail
       FROM cart_items ci
       INNER JOIN products p ON p.id = ci.product_id
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_primary = 1
       LEFT JOIN (
         SELECT product_id, ROUND(price * (100 - discount_percentage) / 100, 0) as discounted_price
         FROM flash_sales fs2
         INNER JOIN products p2 ON fs2.product_id = p2.id
         WHERE fs2.status = 'active' AND fs2.start_time <= NOW() AND fs2.end_time > NOW()
       ) fs ON fs.product_id = p.id
       WHERE ci.cart_id = ?
       ORDER BY ci.created_at DESC`, [cart.id]);
        return rows;
    }
    async addItem(userId, productId, quantity) {
        const cart = await this.getOrCreateCart(userId);
        await database_1.default.query(`INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`, [cart.id, productId, quantity]);
        return this.getItemsByUser(userId);
    }
    async updateItem(itemId, userId, quantity) {
        const cart = await this.getOrCreateCart(userId);
        await database_1.default.query(`UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ? AND cart_id = ?`, [quantity, itemId, cart.id]);
        return this.getItemsByUser(userId);
    }
    async removeItem(itemId, userId) {
        const cart = await this.getOrCreateCart(userId);
        await database_1.default.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [itemId, cart.id]);
        return this.getItemsByUser(userId);
    }
    async clear(userId) {
        const cart = await this.getOrCreateCart(userId);
        await database_1.default.query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
    }
}
const cartRepository = new CartRepository();
exports.default = cartRepository;
//# sourceMappingURL=cartRepositoryImpl.js.map