import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../database';

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  created_at: Date;
}

export interface ProductRecord {
  id: number;
  category_id: number | null;
  name: string;
  description: string | null;
  price: number;
  sku: string;
  stock_quantity: number;
  thumbnail_url?: string | null; // Keep for backward compatibility
  status: 'draft' | 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
  category_name?: string;
  images?: ProductImage[];
}

export interface ProductFilter {
  search?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

class ProductRepository {
  async list(filter: ProductFilter = {}): Promise<{ items: ProductRecord[]; total: number }> {
    const limit = filter.limit ?? 20;
    const offset = filter.offset ?? 0;
    const params: (string | number)[] = [];
    const where: string[] = [];

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

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ${whereClause} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    );
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM products p ${whereClause}`,
      params,
    );

    const total = Number(countRows?.[0]?.total ?? 0);
    const products = rows as ProductRecord[];
    
    // Set thumbnail_url cho mỗi sản phẩm
    for (const product of products) {
      const [imageRows] = await pool.query<RowDataPacket[]>(
        'SELECT image_url FROM product_images WHERE product_id = ? AND is_primary = 1 LIMIT 1',
        [product.id]
      );
      if (imageRows && imageRows.length > 0 && imageRows[0]) {
        product.thumbnail_url = imageRows[0].image_url;
      }
    }
    
    return { items: products, total };
  }

  async findById(id: number): Promise<ProductRecord | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ? LIMIT 1`,
      [id]
    );
    if (!rows.length) {
      return null;
    }
    
    const product = rows[0] as ProductRecord;
    
    // Lấy danh sách hình ảnh
    const [imageRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, id ASC',
      [id]
    );
    
    product.images = imageRows as ProductImage[];
    
    // Set thumbnail_url từ ảnh chính
    const primaryImage = product.images?.find(img => img.is_primary);
    if (primaryImage) {
      product.thumbnail_url = primaryImage.image_url;
    }
    
    return product;
  }

  async create(data: Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ProductRecord> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO products 
        (name, description, price, sku, stock_quantity, category_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.name, data.description, data.price, data.sku, data.stock_quantity, data.category_id, data.status || 'active'],
    );
    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error('Unable to fetch created product');
    }
    return created;
  }

  async update(
    id: number,
    data: Partial<Omit<ProductRecord, 'id' | 'created_at' | 'updated_at'>>,
  ): Promise<ProductRecord | null> {
    const fields = Object.keys(data).filter(key => key !== 'thumbnail_url'); // Ignore thumbnail_url
    if (!fields.length) {
      return this.findById(id);
    }
    const setClause = fields.map((field) => `${field} = :${field}`).join(', ');
    await pool.query<ResultSetHeader>(
      `UPDATE products SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = :id`,
      { ...data, id },
    );
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await pool.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);
  }

  async saveProductImages(productId: number, images: Omit<ProductImage, 'id' | 'product_id' | 'created_at'>[]): Promise<void> {
    // Xóa tất cả ảnh cũ
    await pool.query<ResultSetHeader>('DELETE FROM product_images WHERE product_id = ?', [productId]);
    
    // Thêm ảnh mới
    if (images.length > 0) {
      const values = images.map(img => [
        productId,
        img.image_url,
        img.alt_text || null,
        img.is_primary ? 1 : 0,
      ]);
      
      await pool.query<ResultSetHeader>(
        'INSERT INTO product_images (product_id, image_url, alt_text, is_primary) VALUES ?',
        [values]
      );
    }
  }

  async getTopSelling(limit = 5): Promise<any[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, COALESCE(SUM(oi.quantity), 0) as total_sold
       FROM products p
       LEFT JOIN order_items oi ON p.id = oi.product_id
       LEFT JOIN orders o ON oi.order_id = o.id AND o.status IN ('paid', 'shipped', 'completed')
       GROUP BY p.id
       ORDER BY total_sold DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }
}

const productRepository = new ProductRepository();

export default productRepository;

