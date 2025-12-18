import { Router } from 'express';
import orderController from '../../../modules/orders/order.controller';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/', orderController.createOrder.bind(orderController));
router.get('/', orderController.getOrders.bind(orderController));
router.get('/:id', orderController.getOrderById.bind(orderController));
router.patch('/:id/status', authorize(['admin']), orderController.updateOrderStatus.bind(orderController));

export default router;

