"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class OrderRepository {
    async createOrder(params) {
        const connection = await database_1.default.getConnection();
        try {
            await connection.beginTransaction();
            const [orderResult] = await connection.query(`INSERT INTO orders (
          user_id, address_id, status, payment_method, total_amount, shipping_fee, note,
          recipient_name, recipient_phone, recipient_address, province_id, district_id, ward_code
        ) VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                params.userId,
                params.addressId || null,
                params.paymentMethod,
                params.totalAmount,
                params.shippingFee || 0,
                params.note || null,
                params.recipientName || null,
                params.recipientPhone || null,
                params.recipientAddress || null,
                params.provinceId || null,
                params.districtId || null,
                params.wardCode || null,
            ]);
            const orderId = orderResult.insertId;
            const orderItemsPayload = params.items.map((item) => [
                orderId,
                item.productId,
                item.quantity,
                item.price,
            ]);
            if (orderItemsPayload.length) {
                await connection.query(`INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ?`, [orderItemsPayload]);
            }
            await connection.commit();
            const [rows] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);
            return rows[0];
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    async findById(orderId) {
        const [rows] = await database_1.default.query('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
        if (!rows.length) {
            return null;
        }
        return rows[0];
    }
    async findByIdWithItems(orderId) {
        const order = await this.findById(orderId);
        if (!order) {
            return null;
        }
        const [items] = await database_1.default.query(`SELECT oi.*, p.name as product_name, p.thumbnail_url
       FROM order_items oi
       INNER JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`, [orderId]);
        return {
            ...order,
            items: items,
        };
    }
    async listByUser(userId) {
        const [rows] = await database_1.default.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    }
    async updateStatus(orderId, status) {
        await database_1.default.query('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, orderId]);
        return this.findById(orderId);
    }
    async list(filters, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const params = [];
        let whereClause = '';
        if (filters?.status) {
            whereClause = 'WHERE status = ?';
            params.push(filters.status);
        }
        const [rows] = await database_1.default.query(`SELECT o.*, u.full_name as user_name 
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       ${whereClause} 
       ORDER BY o.created_at DESC 
       LIMIT ? OFFSET ?`, [...params, limit, offset]);
        const [countRows] = await database_1.default.query(`SELECT COUNT(*) as total FROM orders ${whereClause}`, params);
        return {
            orders: rows,
            total: countRows[0]?.total || 0
        };
    }
    async getTotalRevenue() {
        const [rows] = await database_1.default.query(`SELECT COALESCE(SUM(total_amount), 0) as totalRevenue 
       FROM orders 
       WHERE status IN ('paid', 'shipped', 'completed')`);
        return { totalRevenue: rows[0]?.totalRevenue || 0 };
    }
    async getRecentOrders(limit = 5) {
        const [rows] = await database_1.default.query(`SELECT o.*, u.full_name as user_name, u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT ?`, [limit]);
        return rows;
    }
    async getOrdersByStatus() {
        const [rows] = await database_1.default.query(`SELECT status, COUNT(*) as count
       FROM orders
       GROUP BY status`);
        return rows;
    }
    async getRevenueByDay(days = 7) {
        const [rows] = await database_1.default.query(`SELECT 
         DATE(created_at) as date,
         COUNT(*) as orderCount,
         SUM(total_amount) as revenue
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         AND status IN ('paid', 'shipped', 'completed')
       GROUP BY DATE(created_at)
       ORDER BY date ASC`, [days]);
        return rows;
    }
    async updateGHNOrderCode(orderId, ghnOrderCode) {
        await database_1.default.query('UPDATE orders SET ghn_order_code = ? WHERE id = ?', [ghnOrderCode, orderId]);
    }
}
const orderRepository = new OrderRepository();
exports.default = orderRepository;
//# sourceMappingURL=orderRepositoryImpl.js.map