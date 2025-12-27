import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import productRepository from '../../../infrastructure/repositories/productRepositoryImpl';
import categoryRepository from '../../../infrastructure/repositories/categoryRepositoryImpl';
import orderRepository from '../../../infrastructure/repositories/orderRepositoryImpl';
import couponRepository from '../../../infrastructure/repositories/couponRepositoryImpl';
import blogRepository from '../../../infrastructure/repositories/blogRepositoryImpl';

import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Áp dụng middleware cho tất cả routes admin
router.use(authenticate);

// ============================================
// ADMIN - UPLOAD IMAGE
// ============================================
// Lưu ảnh vào web/public/images/products thay vì uploads/products
const uploadDir = path.join(process.cwd(), '..', 'web', 'public', 'images', 'products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/upload', upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file được upload' });
    }

    // Tạo URL cho ảnh - sử dụng đường dẫn public của frontend
    const imageUrl = `/images/products/${req.file.filename}`;

    console.log('File uploaded successfully:', req.file.filename);
    console.log('Upload directory:', uploadDir);
    res.json({
      message: 'Upload ảnh thành công',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Lỗi upload ảnh' });
  }
});

// ============================================
// ADMIN - PRODUCTS
// ============================================

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     tags: [Admin]
 *     summary: Lấy danh sách sản phẩm (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền truy cập
 */
router.get('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;

    const offset = (page - 1) * limit;
    const filters: any = { limit, offset };
    if (search) filters.search = search;
    if (categoryId) filters.category = categoryId.toString();
    
    const products = await productRepository.list(filters);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id!);
    const product = await productRepository.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.json(product);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/products:
 *   post:
 *     tags: [Admin]
 *     summary: Tạo sản phẩm mới
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - sku
 *               - stock_quantity
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               sku:
 *                 type: string
 *               stock_quantity:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               thumbnail_url:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, active, inactive]
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     image_url:
 *                       type: string
 *                     alt_text:
 *                       type: string
 *                     is_primary:
 *                       type: boolean
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 */
router.post('/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { images, ...productData } = req.body;
    const product = await productRepository.create(productData);
    
    // Lưu ảnh nếu có
    if (images && Array.isArray(images) && images.length > 0) {
      await productRepository.saveProductImages(product.id, images);
    }
    
    res.status(201).json({ id: product.id, message: 'Tạo sản phẩm thành công' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/products/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Cập nhật sản phẩm
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               sku:
 *                 type: string
 *               stock_quantity:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               thumbnail_url:
 *                 type: string
 *               status:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.put('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id!);
    const { images, ...productData } = req.body;
    const updated = await productRepository.update(id, productData);
    
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    // Cập nhật ảnh nếu có
    if (images && Array.isArray(images)) {
      await productRepository.saveProductImages(id, images);
    }
    
    res.json({ message: 'Cập nhật sản phẩm thành công' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Xóa sản phẩm
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền truy cập
 */
router.delete('/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id!);
    await productRepository.delete(id);
    
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN - CATEGORIES
// ============================================
router.get('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryRepository.list();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

router.post('/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = await categoryRepository.create(req.body);
    res.status(201).json({ id: categoryId, message: 'Tạo danh mục thành công' });
  } catch (error) {
    next(error);
  }
});

router.put('/categories/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id!);
    const updated = await categoryRepository.update(id, req.body);
    
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    res.json({ message: 'Cập nhật danh mục thành công' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Xóa danh mục
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 *       404:
 *         description: Không tìm thấy danh mục
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền truy cập
 */
router.delete('/categories/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id!);
    const deleted = await categoryRepository.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    res.json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN - ORDERS
// ============================================
router.get('/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string;

    const result = await orderRepository.list({ status }, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/orders/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id!);
    const order = await orderRepository.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    
    res.json(order);
  } catch (error) {
    next(error);
  }
});

router.put('/orders/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id!);
    const { status } = req.body;
    
    const updated = await orderRepository.updateStatus(id, status);
    
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    
    res.json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN - COUPONS
// ============================================
router.get('/coupons', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;

    const filters: any = {};
    if (search) filters.search = search;
    if (isActive !== undefined) filters.isActive = isActive;

    const coupons = await couponRepository.list(filters, page, limit);
    res.json(coupons);
  } catch (error) {
    next(error);
  }
});

router.post('/coupons', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const couponId = await couponRepository.create(req.body);
    res.status(201).json({ id: couponId, message: 'Tạo mã giảm giá thành công' });
  } catch (error) {
    next(error);
  }
});

router.put('/coupons/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id!);
    const updated = await couponRepository.update(id, req.body);
    
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy mã giảm giá' });
    }
    
    res.json({ message: 'Cập nhật mã giảm giá thành công' });
  } catch (error) {
    next(error);
  }
});

router.delete('/coupons/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id!);
    const deleted = await couponRepository.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy mã giảm giá' });
    }
    
    res.json({ message: 'Xóa mã giảm giá thành công' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN - BLOGS
// ============================================
router.get('/blogs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const isPublished = req.query.isPublished === 'true' ? true : req.query.isPublished === 'false' ? false : undefined;

    const filters: any = {};
    if (search) filters.search = search;
    if (category) filters.category = category;
    if (isPublished !== undefined) filters.isPublished = isPublished;

    const blogs = await blogRepository.list(filters, page, limit);
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.get('/blogs/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id!);
    const blog = await blogRepository.findById(id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
    
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.post('/blogs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogData = {
      ...req.body,
      author_id: req.user!.id
    };
    const blogId = await blogRepository.create(blogData);
    res.status(201).json({ id: blogId, message: 'Tạo bài viết thành công' });
  } catch (error) {
    next(error);
  }
});

router.put('/blogs/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id!);
    const updated = await blogRepository.update(id, req.body);
    
    if (!updated) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
    
    res.json({ message: 'Cập nhật bài viết thành công' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/blogs/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Xóa bài viết blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bài viết
 *     responses:
 *       200:
 *         description: Xóa bài viết thành công
 *       404:
 *         description: Không tìm thấy bài viết
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền truy cập
 */
router.delete('/blogs/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id!);
    const deleted = await blogRepository.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết' });
    }
    
    res.json({ message: 'Xóa bài viết thành công' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ADMIN - DASHBOARD STATS
// ============================================
router.get('/dashboard/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productsData = await productRepository.list({ limit: 1, offset: 0 });
    const categories = await categoryRepository.list();
    const ordersData = await orderRepository.list({}, 1, 1);
    
    // Tính tổng doanh thu
    const revenueResult = await orderRepository.getTotalRevenue();
    
    // Lấy đơn hàng gần đây (5 đơn)
    const recentOrders = await orderRepository.getRecentOrders(5);
    
    // Lấy sản phẩm bán chạy (5 sản phẩm)
    const topProducts = await productRepository.getTopSelling(5);
    
    // Thống kê theo trạng thái đơn hàng
    const ordersByStatus = await orderRepository.getOrdersByStatus();
    
    // Doanh thu 7 ngày gần đây
    const revenueByDay = await orderRepository.getRevenueByDay(7);
    
    const stats = {
      totalProducts: productsData.total,
      totalCategories: categories.length,
      totalOrders: ordersData.total,
      totalRevenue: revenueResult.totalRevenue,
      recentOrders,
      topProducts,
      ordersByStatus,
      revenueByDay
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

export default router;
