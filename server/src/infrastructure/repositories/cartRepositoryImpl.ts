import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../database';

export interface CartItemRecord {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
  product_name?: string;
  price?: number;
  stock_quantity?: number;
  product_thumbnail?: string;
}

export interface CartRecord {
  id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

class CartRepository {
  async getOrCreateCart(userId: number): Promise<CartRecord> {
    // Try to get existing cart
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM carts WHERE user_id = ? LIMIT 1',
      [userId]
    );
    
    if (rows.length > 0) {
      return rows[0] as CartRecord;
    }
    
    // Create new cart if doesn't exist
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO carts (user_id) VALUES (?)',
      [userId]
    );
    
    const [newRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM carts WHERE id = ?',
      [result.insertId]
    );
    
    return newRows[0] as CartRecord;
  }

  async getItemsByUser(userId: number): Promise<CartItemRecord[]> {
    const cart = await this.getOrCreateCart(userId);
    
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT ci.*, p.name as product_name, 
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
       ORDER BY ci.created_at DESC`,
      [cart.id],
    );
    return rows as CartItemRecord[];
  }

  async addItem(userId: number, productId: number, quantity: number): Promise<CartItemRecord[]> {
    const cart = await this.getOrCreateCart(userId);
    
    await pool.query<ResultSetHeader>(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [cart.id, productId, quantity],
    );
    return this.getItemsByUser(userId);
  }

  async updateItem(itemId: number, userId: number, quantity: number): Promise<CartItemRecord[]> {
    const cart = await this.getOrCreateCart(userId);
    
    await pool.query<ResultSetHeader>(
      `UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ? AND cart_id = ?`,
      [quantity, itemId, cart.id],
    );
    return this.getItemsByUser(userId);
  }

  async removeItem(itemId: number, userId: number): Promise<CartItemRecord[]> {
    const cart = await this.getOrCreateCart(userId);
    
    await pool.query<ResultSetHeader>(
      'DELETE FROM cart_items WHERE id = ? AND cart_id = ?',
      [itemId, cart.id]
    );
    return this.getItemsByUser(userId);
  }

  async clear(userId: number): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    await pool.query<ResultSetHeader>('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
  }
}

const cartRepository = new CartRepository();

export default cartRepository;

