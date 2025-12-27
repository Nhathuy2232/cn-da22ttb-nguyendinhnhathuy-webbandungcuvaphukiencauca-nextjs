import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../database';

export interface OrderRecord {
  id: number;
  user_id: number;
  address_id: number | null;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  payment_method: 'cod' | 'bank_transfer' | 'e_wallet';
  total_amount: number;
  shipping_fee?: number;
  ghn_order_code?: string;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_address?: string;
  province_id?: number;
  district_id?: number;
  ward_code?: string;
  note: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItemRecord {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date;
  product_name?: string;
}

export interface OrderWithItems extends OrderRecord {
  items: OrderItemRecord[];
}

class OrderRepository {
  async createOrder(params: {
    userId: number;
    addressId?: number | null;
    totalAmount: number;
    shippingFee?: number;
    paymentMethod: 'cod' | 'bank_transfer' | 'e_wallet';
    note?: string;
    items: { productId: number; quantity: number; price: number }[];
    recipientName?: string;
    recipientPhone?: string;
    recipientAddress?: string;
    provinceId?: number;
    districtId?: number;
    wardCode?: string;
  }): Promise<OrderRecord> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const [orderResult] = await connection.query<ResultSetHeader>(
        `INSERT INTO orders (
          user_id, address_id, status, payment_method, total_amount, shipping_fee, note,
          recipient_name, recipient_phone, recipient_address, province_id, district_id, ward_code
        ) VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
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
        ],
      );

      const orderId = orderResult.insertId;
      const orderItemsPayload = params.items.map((item) => [
        orderId,
        item.productId,
        item.quantity,
        item.price,
      ]);

      if (orderItemsPayload.length) {
        await connection.query<ResultSetHeader>(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ?`,
          [orderItemsPayload],
        );
      }

      await connection.commit();
      
      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM orders WHERE id = ?', [orderId]);
      return rows[0] as OrderRecord;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async findById(orderId: number): Promise<OrderRecord | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM orders WHERE id = ? LIMIT 1',
      [orderId]
    );
    if (!rows.length) {
      return null;
    }
    return rows[0] as OrderRecord;
  }

  async findByIdWithItems(orderId: number): Promise<OrderWithItems | null> {
    const order = await this.findById(orderId);
    if (!order) {
      return null;
    }

    const [items] = await pool.query<RowDataPacket[]>(
      `SELECT oi.*, p.name as product_name
       FROM order_items oi
       INNER JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    return {
      ...order,
      items: items as OrderItemRecord[],
    };
  }

  async listByUser(userId: number): Promise<OrderRecord[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
    );
    return rows as OrderRecord[];
  }

  async updateStatus(
    orderId: number,
    status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  ): Promise<OrderRecord | null> {
    await pool.query<ResultSetHeader>(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, orderId]
    );
    return this.findById(orderId);
  }

  async list(filters?: { status?: string }, page = 1, limit = 20): Promise<{ orders: OrderRecord[]; total: number }> {
    const offset = (page - 1) * limit;
    const params: any[] = [];
    let whereClause = '';

    if (filters?.status) {
      whereClause = 'WHERE status = ?';
      params.push(filters.status);
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT o.*, u.full_name as user_name, u.email as user_email
       FROM orders o 
       LEFT JOIN users u ON o.user_id = u.id 
       ${whereClause} 
       ORDER BY o.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM orders ${whereClause}`,
      params
    );
    
    return {
      orders: rows as OrderRecord[],
      total: countRows[0]?.total || 0
    };
  }

  async getTotalRevenue(): Promise<{ totalRevenue: number }> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(total_amount), 0) as totalRevenue 
       FROM orders 
       WHERE status IN ('paid', 'shipped', 'completed')`
    );
    return { totalRevenue: rows[0]?.totalRevenue || 0 };
  }

  async getRecentOrders(limit = 5): Promise<any[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT o.*, u.full_name as user_name, u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }

  async getOrdersByStatus(): Promise<any[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT status, COUNT(*) as count
       FROM orders
       GROUP BY status`
    );
    return rows;
  }

  async getRevenueByDay(days = 7): Promise<any[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT 
         DATE(created_at) as date,
         COUNT(*) as orderCount,
         SUM(total_amount) as revenue
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         AND status IN ('paid', 'shipped', 'completed')
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [days]
    );
    return rows;
  }

  async updateGHNOrderCode(orderId: number, ghnOrderCode: string): Promise<void> {
    await pool.query<ResultSetHeader>(
      'UPDATE orders SET ghn_order_code = ? WHERE id = ?',
      [ghnOrderCode, orderId]
    );
  }
}

const orderRepository = new OrderRepository();

export default orderRepository;

