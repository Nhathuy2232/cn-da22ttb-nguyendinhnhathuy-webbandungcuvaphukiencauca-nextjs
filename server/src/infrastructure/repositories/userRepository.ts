import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../database';

export type UserRole = 'customer' | 'admin';

export interface UserRecord {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

class UserRepository {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email],
    );
    if (!rows.length) {
      return null;
    }
    return rows[0] as UserRecord;
  }

  async findById(id: number): Promise<UserRecord | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ? LIMIT 1',
      [id],
    );
    if (!rows.length) {
      return null;
    }
    return rows[0] as UserRecord;
  }

  async create(data: {
    fullName: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
  }): Promise<UserRecord> {
    const payload = {
      full_name: data.fullName,
      email: data.email,
      password_hash: data.passwordHash,
      role: data.role ?? 'customer',
    };

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (:full_name, :email, :password_hash, :role)',
      payload,
    );

    const inserted = await this.findById(result.insertId);
    if (!inserted) {
      throw new Error('Unable to fetch inserted user');
    }
    return inserted;
  }

  async list(): Promise<UserRecord[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users ORDER BY created_at DESC');
    return rows as UserRecord[];
  }
}

const userRepository = new UserRepository();

export default userRepository;

