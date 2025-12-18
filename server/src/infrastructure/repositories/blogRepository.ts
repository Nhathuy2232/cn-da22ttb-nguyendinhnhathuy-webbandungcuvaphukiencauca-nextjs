import pool from '../database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface BlogRecord {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  author_id?: number;
  category?: string;
  tags?: string[];
  view_count: number;
  is_published: boolean;
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
  author_name?: string;
}

interface BlogFilters {
  isPublished?: boolean;
  category?: string;
  search?: string;
  authorId?: number;
}

class BlogRepository {
  async list(filters?: BlogFilters, page = 1, limit = 20): Promise<{ blogs: BlogRecord[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: any[] = [];

    if (filters?.isPublished !== undefined) {
      conditions.push('b.is_published = ?');
      params.push(filters.isPublished);
    }

    if (filters?.category) {
      conditions.push('b.category = ?');
      params.push(filters.category);
    }

    if (filters?.authorId) {
      conditions.push('b.author_id = ?');
      params.push(filters.authorId);
    }

    if (filters?.search) {
      conditions.push('(b.title LIKE ? OR b.excerpt LIKE ? OR b.content LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM blogs b ${where}`;
    const [countRows] = await pool.query<RowDataPacket[]>(countSql, params);
    const total = (countRows[0] as any).total;
    
    // Get blogs
    const sql = `
      SELECT b.*, u.full_name as author_name 
      FROM blogs b 
      LEFT JOIN users u ON b.author_id = u.id 
      ${where} 
      ORDER BY b.created_at DESC 
      LIMIT ? OFFSET ?
    `;
    params.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    const blogs = rows.map(row => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    })) as BlogRecord[];
    
    return { blogs, total, page, limit };
  }

  async findById(id: number): Promise<BlogRecord | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT b.*, u.full_name as author_name 
       FROM blogs b 
       LEFT JOIN users u ON b.author_id = u.id 
       WHERE b.id = ?`,
      [id]
    );
    
    if (rows.length === 0) return null;
    
    const blog = rows[0] as BlogRecord;
    blog.tags = blog.tags ? JSON.parse(blog.tags as any) : [];
    return blog;
  }

  async findBySlug(slug: string): Promise<BlogRecord | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT b.*, u.full_name as author_name 
       FROM blogs b 
       LEFT JOIN users u ON b.author_id = u.id 
       WHERE b.slug = ?`,
      [slug]
    );
    
    if (rows.length === 0) return null;
    
    const blog = rows[0] as BlogRecord;
    blog.tags = blog.tags ? JSON.parse(blog.tags as any) : [];
    return blog;
  }

  async create(data: Partial<BlogRecord>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO blogs (title, slug, excerpt, content, thumbnail, author_id, category, tags, 
       is_published, published_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.slug,
        data.excerpt,
        data.content,
        data.thumbnail,
        data.author_id,
        data.category,
        data.tags ? JSON.stringify(data.tags) : null,
        data.is_published || false,
        data.is_published ? new Date() : null
      ]
    );
    return result.insertId;
  }

  async update(id: number, data: Partial<BlogRecord>): Promise<boolean> {
    const updates: string[] = [];
    const params: any[] = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      params.push(data.title);
    }
    if (data.slug !== undefined) {
      updates.push('slug = ?');
      params.push(data.slug);
    }
    if (data.excerpt !== undefined) {
      updates.push('excerpt = ?');
      params.push(data.excerpt);
    }
    if (data.content !== undefined) {
      updates.push('content = ?');
      params.push(data.content);
    }
    if (data.thumbnail !== undefined) {
      updates.push('thumbnail = ?');
      params.push(data.thumbnail);
    }
    if (data.category !== undefined) {
      updates.push('category = ?');
      params.push(data.category);
    }
    if (data.tags !== undefined) {
      updates.push('tags = ?');
      params.push(JSON.stringify(data.tags));
    }
    if (data.is_published !== undefined) {
      updates.push('is_published = ?');
      params.push(data.is_published);
      if (data.is_published) {
        updates.push('published_at = ?');
        params.push(new Date());
      }
    }

    if (updates.length === 0) return false;

    params.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM blogs WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async incrementViewCount(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE blogs SET view_count = view_count + 1 WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  async getCategories(): Promise<string[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT DISTINCT category FROM blogs WHERE category IS NOT NULL AND is_published = TRUE ORDER BY category'
    );
    return rows.map(row => row.category);
  }
}

export default new BlogRepository();
