import pool from '../database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface WishlistItem extends RowDataPacket {
  id: number;
  user_id: number;
  product_id: number;
  created_at: Date;
  // Joined product info
  product_name?: string;
  price?: number;
  thumbnail_url?: string;
  stock_quantity?: number;
}

class WishlistRepository {
  /**
   * Thêm sản phẩm vào wishlist
   */
  async addItem(userId: number, productId: number): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );
    return result.insertId;
  }

  /**
   * Xóa sản phẩm khỏi wishlist
   */
  async removeItem(userId: number, productId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Lấy danh sách wishlist của user
   */
  async getByUser(userId: number): Promise<WishlistItem[]> {
    const [rows] = await pool.query<WishlistItem[]>(
      `SELECT 
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
      ORDER BY w.created_at DESC`,
      [userId]
    );
    return rows;
  }

  /**
   * Kiểm tra sản phẩm có trong wishlist không
   */
  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return rows.length > 0;
  }

  /**
   * Xóa toàn bộ wishlist của user
   */
  async clearUserWishlist(userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM wishlists WHERE user_id = ?',
      [userId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Đếm số sản phẩm trong wishlist
   */
  async countByUser(userId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM wishlists WHERE user_id = ?',
      [userId]
    );
    return rows[0].count;
  }
}

export default new WishlistRepository();
