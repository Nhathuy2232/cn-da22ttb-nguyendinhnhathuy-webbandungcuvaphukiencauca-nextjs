import { Router } from 'express';
import categoryController from '../../../modules/categories/category.controller';

const router = Router();

router.get('/', categoryController.getAll.bind(categoryController));
router.get('/:id', categoryController.getById.bind(categoryController));

export default router;
