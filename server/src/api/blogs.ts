import { Router, Request, Response, NextFunction } from 'express';
import blogRepository from '../infrastructure/repositories/blogRepositoryImpl';

const router = Router();

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     tags: [Blogs]
 *     summary: Lấy danh sách blog
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tiêu đề
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo danh mục
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Lọc bài viết đã xuất bản
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *         description: Tìm theo slug
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Danh sách blog
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 */
// GET /api/blogs - Lấy danh sách blog (public)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const isPublished = req.query.isPublished === 'true' ? true : req.query.isPublished === 'false' ? false : undefined;
    const slug = req.query.slug as string;

    const filters: any = {};
    if (search) filters.search = search;
    if (category) filters.category = category;
    if (isPublished !== undefined) filters.isPublished = isPublished;
    if (slug) filters.slug = slug;

    const result = await blogRepository.list(filters, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     tags: [Blogs]
 *     summary: Lấy chi tiết blog và tăng lượt xem
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID blog
 *     responses:
 *       200:
 *         description: Chi tiết blog
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Không tìm thấy bài viết
 */
// GET /api/blogs/:id - Lấy chi tiết blog (public)
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id || '0');
    const blog = await blogRepository.findById(id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
    
    // Tăng view count
    await blogRepository.incrementViewCount(id);
    
    // Lấy lại blog với view_count đã được cập nhật
    const updatedBlog = await blogRepository.findById(id);
    
    res.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

export default router;
