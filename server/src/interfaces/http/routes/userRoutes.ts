import { Router } from 'express';
import userService from '../../../modules/users/user.service';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authenticate, authorize(['admin']), async (_req, res, next) => {
  try {
    const users = await userService.list();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default router;

