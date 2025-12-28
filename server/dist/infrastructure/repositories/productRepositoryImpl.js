"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class ProductRepository {
    async list(filter = {}) {
        const limit = filter.limit ?? 20;
        const offset = filter.offset ?? 0;
        const params = [];
        const where = [];
        if (filter.search) {
            where.push('(p.name LIKE ? OR p.description LIKE ?)');
            const keyword = `%${filter.search}%`;
            params.push(keyword, keyword);
        }
        if (filter.category) {
            where.push('p.category_id = ?');
            params.push(filter.category);
        }
        const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const [rows] = await database_1.default.query(`SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ${whereClause} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
        const [countRows] = await database_1.default.query(`SELECT COUNT(*) as total FROM products p ${whereClause}`, params);
        const total = Number(countRows?.[0]?.total ?? 0);
        const products = rows;
        // Set thumbnail_url cho mỗi sản phẩm
        for (const product of products) {
            const [imageRows] = await database_1.default.query('SELECT image_url FROM product_images WHERE product_id = ? AND is_primary = 1 LIMIT 1', [product.id]);
            if (imageRows && imageRows.length > 0 && imageRows[0]) {
                product.thumbnail_url = imageRows[0].image_url;
            }
        }
        return { items: products, total };
    }
    async findById(id) {
        const [rows] = await database_1.default.query(`SELECT p.*, c.name as category_name,
       COALESCE(fs.discounted_price, p.price) as effective_price,
       fs.discount_percentage, fs.start_time, fs.end_time
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN (
         SELECT product_id, ROUND(price * (100 - discount_percentage) / 100, 0) as discounted_price,
         discount_percentage, start_time, end_time
         FROM flash_sales fs2
         INNER JOIN products p2 ON fs2.product_id = p2.id
         WHERE fs2.status = 'active' AND fs2.start_time <= NOW() AND fs2.end_time > NOW()
       ) fs ON fs.product_id = p.id
       WHERE p.id = ? LIMIT 1`, [id]);
        if (!rows.length) {
            return null;
        }
        const product = rows[0];
        // Lấy danh sách hình ảnh
        const [imageRows] = await database_1.default.query('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, id ASC', [id]);
        product.images = imageRows;
        // Set thumbnail_url từ ảnh chính
        const primaryImage = product.images?.find(img => img.is_primary);
        if (primaryImage) {
            product.thumbnail_url = primaryImage.image_url;
        }
        return product;
    }
    async create(data) {
        const [result] = await database_1.default.query(`INSERT INTO products 
        (name, description, price, sku, stock_quantity, category_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [data.name, data.description, data.price, data.sku, data.stock_quantity, data.category_id, data.status || 'active']);
        const created = await this.findById(result.insertId);
        if (!created) {
            throw new Error('Unable to fetch created product');
        }
        return created;
    }
    async update(id, data) {
        const fields = Object.keys(data).filter(key => key !== 'thumbnail_url'); // Ignore thumbnail_url
        if (!fields.length) {
            return this.findById(id);
        }
        const setClause = fields.map((field) => `${field} = :${field}`).join(', ');
        await database_1.default.query(`UPDATE products SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = :id`, { ...data, id });
        return this.findById(id);
    }
    async delete(id) {
        await database_1.default.query('DELETE FROM products WHERE id = ?', [id]);
    }
    async saveProductImages(productId, images) {
        // Xóa tất cả ảnh cũ
        await database_1.default.query('DELETE FROM product_images WHERE product_id = ?', [productId]);
        // Thêm ảnh mới
        if (images.length > 0) {
            const values = images.map(img => [
                productId,
                img.image_url,
                img.alt_text || null,
                img.is_primary ? 1 : 0,
            ]);
            await database_1.default.query('INSERT INTO product_images (product_id, image_url, alt_text, is_primary) VALUES ?', [values]);
        }
    }
    async getTopSelling(limit = 5) {
        const [rows] = await database_1.default.query(`SELECT p.*, COALESCE(SUM(oi.quantity), 0) as total_sold
       FROM products p
       LEFT JOIN order_items oi ON p.id = oi.product_id
       LEFT JOIN orders o ON oi.order_id = o.id AND o.status IN ('paid', 'shipped', 'completed')
       GROUP BY p.id
       ORDER BY total_sold DESC
       LIMIT ?`, [limit]);
        return rows;
    }
}
const productRepository = new ProductRepository();
exports.default = productRepository;
//# sourceMappingURL=productRepositoryImpl.js.map