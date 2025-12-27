"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class BlogRepository {
    async list(filters, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const conditions = [];
        const params = [];
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
        const [countRows] = await database_1.default.query(countSql, params);
        const total = countRows[0].total;
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
        const [rows] = await database_1.default.query(sql, params);
        const blogs = rows.map(row => ({
            ...row,
            tags: row.tags ? JSON.parse(row.tags) : []
        }));
        return { blogs, total, page, limit };
    }
    async findById(id) {
        const [rows] = await database_1.default.query(`SELECT b.*, u.full_name as author_name 
       FROM blogs b 
       LEFT JOIN users u ON b.author_id = u.id 
       WHERE b.id = ?`, [id]);
        if (rows.length === 0)
            return null;
        const blog = rows[0];
        blog.tags = blog.tags ? JSON.parse(blog.tags) : [];
        return blog;
    }
    async findBySlug(slug) {
        const [rows] = await database_1.default.query(`SELECT b.*, u.full_name as author_name 
       FROM blogs b 
       LEFT JOIN users u ON b.author_id = u.id 
       WHERE b.slug = ?`, [slug]);
        if (rows.length === 0)
            return null;
        const blog = rows[0];
        blog.tags = blog.tags ? JSON.parse(blog.tags) : [];
        return blog;
    }
    async create(data) {
        const [result] = await database_1.default.query(`INSERT INTO blogs (title, slug, excerpt, content, thumbnail, author_id, category, tags, 
       is_published, published_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
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
        ]);
        return result.insertId;
    }
    async update(id, data) {
        const updates = [];
        const params = [];
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
        if (updates.length === 0)
            return false;
        params.push(id);
        const [result] = await database_1.default.query(`UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`, params);
        return result.affectedRows > 0;
    }
    async delete(id) {
        const [result] = await database_1.default.query('DELETE FROM blogs WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    async incrementViewCount(id) {
        const [result] = await database_1.default.query('UPDATE blogs SET view_count = view_count + 1 WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    async getCategories() {
        const [rows] = await database_1.default.query('SELECT DISTINCT category FROM blogs WHERE category IS NOT NULL AND is_published = TRUE ORDER BY category');
        return rows.map(row => row.category);
    }
}
exports.default = new BlogRepository();
//# sourceMappingURL=blogRepositoryImpl.js.map