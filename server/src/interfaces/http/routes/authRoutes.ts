import { Router } from 'express';
import authController from '../../../modules/auth/auth.controller';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.get('/me', authenticate, authController.getMe.bind(authController));

export default router;

