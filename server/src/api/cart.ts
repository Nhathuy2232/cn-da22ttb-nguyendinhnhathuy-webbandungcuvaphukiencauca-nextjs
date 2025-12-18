import { Router } from 'express';
import cartController from '../modules/cart/cart.controller';
import { authenticate } from '../interfaces/http/middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart.bind(cartController));
router.post('/', cartController.addItem.bind(cartController));
router.put('/', cartController.updateItem.bind(cartController));
router.delete('/:id', cartController.removeItem.bind(cartController));
router.delete('/', cartController.clearCart.bind(cartController));

export default router;
