import { Router } from 'express';
import productController from '../../../modules/products/product.controller';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', productController.getAll.bind(productController));
router.get('/:id', productController.getById.bind(productController));

export default router;

