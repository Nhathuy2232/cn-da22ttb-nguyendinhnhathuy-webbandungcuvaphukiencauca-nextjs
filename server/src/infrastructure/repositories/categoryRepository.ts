import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import pool from '../database';

export interface CategoryRecord {
  id: number;
  name: string;
  description: string | null;
  created_at: Date;
}

class CategoryRepository {
  async list(): Promise<CategoryRecord[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    return rows as CategoryRecord[];
  }

  async findById(id: number): Promise<CategoryRecord | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories WHERE id = ? LIMIT 1',
      [id]
    );
    if (!rows.length) {
      return null;
    }
    return rows[0] as CategoryRecord;
  }

  async findByName(name: string): Promise<CategoryRecord | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories WHERE name = ? LIMIT 1',
      [name]
    );
    if (!rows.length) {
      return null;
    }
    return rows[0] as CategoryRecord;
  }

  async create(data: Partial<CategoryRecord>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [data.name, data.description || null]
    );
    return result.insertId;
  }

  async update(id: number, data: Partial<CategoryRecord>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [data.name, data.description, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

const categoryRepository = new CategoryRepository();
export default categoryRepository;
