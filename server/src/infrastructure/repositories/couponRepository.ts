import pool from '../database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface CouponRecord {
  id: number;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface CouponFilters {
  isActive?: boolean;
  search?: string;
}

class CouponRepository {
  async list(filters?: CouponFilters, page = 1, limit = 20): Promise<CouponRecord[]> {
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters?.isActive !== undefined) {
      conditions.push('is_active = ?');
      params.push(filters.isActive);
    }

    if (filters?.search) {
      conditions.push('(code LIKE ? OR description LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM coupons ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows as CouponRecord[];
  }

  async findById(id: number): Promise<CouponRecord | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM coupons WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as CouponRecord) : null;
  }

  async findByCode(code: string): Promise<CouponRecord | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM coupons WHERE code = ? AND is_active = TRUE',
      [code]
    );
    return rows.length > 0 ? (rows[0] as CouponRecord) : null;
  }

  async create(data: Partial<CouponRecord>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, 
       max_discount, usage_limit, start_date, end_date, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.code,
        data.description,
        data.discount_type,
        data.discount_value,
        data.min_order_value || 0,
        data.max_discount,
        data.usage_limit,
        data.start_date,
        data.end_date,
        data.is_active !== undefined ? data.is_active : true
      ]
    );
    return result.insertId;
  }

  async update(id: number, data: Partial<CouponRecord>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE coupons SET code = ?, description = ?, discount_type = ?, discount_value = ?,
       min_order_value = ?, max_discount = ?, usage_limit = ?, start_date = ?, end_date = ?, is_active = ?
       WHERE id = ?`,
      [
        data.code,
        data.description,
        data.discount_type,
        data.discount_value,
        data.min_order_value,
        data.max_discount,
        data.usage_limit,
        data.start_date,
        data.end_date,
        data.is_active,
        id
      ]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM coupons WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async incrementUsedCount(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async validateCoupon(code: string, orderValue: number): Promise<{ valid: boolean; message?: string; coupon?: CouponRecord }> {
    const coupon = await this.findByCode(code);
    
    if (!coupon) {
      return { valid: false, message: 'Mã giảm giá không tồn tại' };
    }

    if (!coupon.is_active) {
      return { valid: false, message: 'Mã giảm giá đã bị vô hiệu hóa' };
    }

    const now = new Date();
    if (now < new Date(coupon.start_date)) {
      return { valid: false, message: 'Mã giảm giá chưa có hiệu lực' };
    }

    if (now > new Date(coupon.end_date)) {
      return { valid: false, message: 'Mã giảm giá đã hết hạn' };
    }

    if (orderValue < coupon.min_order_value) {
      return { valid: false, message: `Đơn hàng tối thiểu ${coupon.min_order_value.toLocaleString('vi-VN')}đ` };
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { valid: false, message: 'Mã giảm giá đã hết lượt sử dụng' };
    }

    return { valid: true, coupon };
  }
}

export default new CouponRepository();
