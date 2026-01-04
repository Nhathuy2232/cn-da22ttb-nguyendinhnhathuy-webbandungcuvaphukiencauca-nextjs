import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../database';

export interface FlashSaleRecord {
  id: number;
  product_id: number;
  discount_percentage: number;
  start_time: Date;
  end_time: Date;
  status: 'active' | 'inactive' | 'expired';
  created_at: Date;
  updated_at: Date;
}

export interface FlashSaleWithProduct extends FlashSaleRecord {
  product_name: string;
  product_price: number;
  product_thumbnail: string | null;
  discounted_price: number;
}

class FlashSaleRepository {
  async create(data: {
    product_id: number;
    discount_percentage: number;
    start_time: Date;
    end_time: Date;
    status?: 'active' | 'inactive';
  }): Promise<FlashSaleRecord> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO flash_sales (product_id, discount_percentage, start_time, end_time, status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.product_id,
        data.discount_percentage,
        data.start_time,
        data.end_time,
        data.status || 'active',
      ]
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM flash_sales WHERE id = ?',
      [result.insertId]
    );

    return rows[0] as FlashSaleRecord;
  }

  async findById(id: number): Promise<FlashSaleRecord | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM flash_sales WHERE id = ?',
      [id]
    );

    return rows.length ? (rows[0] as FlashSaleRecord) : null;
  }

  async findByProductId(productId: number): Promise<FlashSaleRecord | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM flash_sales WHERE product_id = ? AND status = "active" ORDER BY created_at DESC LIMIT 1',
      [productId]
    );

    return rows.length ? (rows[0] as FlashSaleRecord) : null;
  }

  async listActive(): Promise<FlashSaleWithProduct[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT DISTINCT
        fs.id, fs.product_id, fs.discount_percentage, fs.start_time, fs.end_time, fs.status, fs.created_at, fs.updated_at,
        p.name as product_name,
        p.price as product_price,
        pi.image_url as product_thumbnail,
        ROUND(p.price * (100 - fs.discount_percentage) / 100, 0) as discounted_price,
        COALESCE(p.stock_quantity, 100) as flash_sale_quantity,
        0 as sold_quantity
       FROM flash_sales fs
       INNER JOIN products p ON fs.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
       WHERE fs.status = 'active' 
       AND fs.start_time <= NOW() 
       AND fs.end_time > NOW()
       ORDER BY fs.created_at DESC`
    );

    return rows as FlashSaleWithProduct[];
  }

  async listAll(filter?: { status?: string; limit?: number; offset?: number }) {
    const limit = filter?.limit ?? 20;
    const offset = filter?.offset ?? 0;
    const whereClause = filter?.status ? `WHERE fs.status = ?` : '';
    const params = filter?.status ? [filter.status, limit, offset] : [limit, offset];

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT
        fs.*,
        p.name as product_name,
        p.price as product_price,
        '' as product_thumbnail,
        ROUND(p.price * (100 - fs.discount_percentage) / 100, 0) as discounted_price
       FROM flash_sales fs
       INNER JOIN products p ON fs.product_id = p.id
       ${whereClause}
       ORDER BY fs.created_at DESC
       LIMIT ? OFFSET ?`,
      params
    );

    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM flash_sales fs ${whereClause}`,
      filter?.status ? [filter.status] : []
    );

    return {
      items: rows as FlashSaleWithProduct[],
      total: Number(countRows[0]?.total ?? 0),
    };
  }

  async update(
    id: number,
    data: {
      discount_percentage?: number;
      start_time?: Date;
      end_time?: Date;
      status?: 'active' | 'inactive' | 'expired';
    }
  ): Promise<FlashSaleRecord | null> {
    const updates: string[] = [];
    const values: any[] = [];

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

    await pool.query<ResultSetHeader>(
      `UPDATE flash_sales SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM flash_sales WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  async deleteByProductId(productId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM flash_sales WHERE product_id = ?',
      [productId]
    );

    return result.affectedRows > 0;
  }
}

export default new FlashSaleRepository();
