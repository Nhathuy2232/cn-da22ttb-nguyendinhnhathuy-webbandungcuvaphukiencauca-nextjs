import pool from '../database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface Review extends RowDataPacket {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
  // Joined user info
  user_name?: string;
}

interface ReviewStats extends RowDataPacket {
  average_rating: number;
  total_reviews: number;
  rating_1: number;
  rating_2: number;
  rating_3: number;
  rating_4: number;
  rating_5: number;
}

class ReviewRepository {
  /**
   * Tạo đánh giá mới
   */
  async create(data: {
    productId: number;
    userId: number;
    rating: number;
    comment?: string;
  }): Promise<Review> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO product_reviews (product_id, user_id, rating, comment)
       VALUES (?, ?, ?, ?)`,
      [data.productId, data.userId, data.rating, data.comment || null]
    );

    const [rows] = await pool.query<Review[]>(
      'SELECT * FROM product_reviews WHERE id = ?',
      [result.insertId]
    );
    return rows[0];
  }

  /**
   * Cập nhật đánh giá
   */
  async update(
    id: number,
    userId: number,
    data: { rating?: number; comment?: string }
  ): Promise<boolean> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.rating !== undefined) {
      updates.push('rating = ?');
      values.push(data.rating);
    }
    if (data.comment !== undefined) {
      updates.push('comment = ?');
      values.push(data.comment);
    }

    if (updates.length === 0) return false;

    values.push(id, userId);

    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE product_reviews SET ${updates.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  /**
   * Xóa đánh giá
   */
  async delete(id: number, userId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM product_reviews WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Lấy danh sách đánh giá của sản phẩm
   */
  async getByProduct(productId: number, limit = 10, offset = 0): Promise<Review[]> {
    const [rows] = await pool.query<Review[]>(
      `SELECT 
        r.*,
        u.full_name as user_name
      FROM product_reviews r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?`,
      [productId, limit, offset]
    );
    return rows;
  }

  /**
   * Lấy thống kê đánh giá của sản phẩm
   */
  async getProductStats(productId: number): Promise<ReviewStats> {
    const [rows] = await pool.query<ReviewStats[]>(
      `SELECT 
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as total_reviews,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as rating_1,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as rating_2,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as rating_3,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as rating_4,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as rating_5
      FROM product_reviews
      WHERE product_id = ?`,
      [productId]
    );
    return rows[0];
  }

  /**
   * Kiểm tra user đã review sản phẩm chưa
   */
  async hasUserReviewed(userId: number, productId: number): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM product_reviews WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return rows.length > 0;
  }

  /**
   * Lấy đánh giá của user cho sản phẩm
   */
  async getUserReview(userId: number, productId: number): Promise<Review | null> {
    const [rows] = await pool.query<Review[]>(
      'SELECT * FROM product_reviews WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return rows[0] || null;
  }

  /**
   * Lấy tất cả đánh giá của user
   */
  async getByUser(userId: number): Promise<Review[]> {
    const [rows] = await pool.query<Review[]>(
      `SELECT r.*, p.name as product_name
       FROM product_reviews r
       INNER JOIN products p ON r.product_id = p.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );
    return rows;
  }
}

export default new ReviewRepository();
