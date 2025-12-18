import { Router } from 'express';
import authController from '../modules/auth/auth.controller';
import { authenticate } from '../interfaces/http/middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng ký tài khoản mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: "0901234567"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/register', authController.register.bind(authController));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@fishing-shop.com
 *               password:
 *                 type: string
 *                 example: Admin123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 */
router.post('/login', authController.login.bind(authController));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng xuất
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
router.post('/logout', authController.logout.bind(authController));

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Lấy thông tin người dùng hiện tại
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Chưa xác thực
 */
router.get('/me', authenticate, authController.getMe.bind(authController));

export default router;
