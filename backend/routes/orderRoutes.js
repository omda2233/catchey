import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Place order (buyer only)
router.post('/', authMiddleware, roleMiddleware('buyer'), orderController.placeOrder);

// Update delivery status (delivery only)
router.put('/:id/delivery-status', authMiddleware, roleMiddleware('delivery'), orderController.updateDeliveryStatus);

// Update order status (merchant or admin)
router.put('/:id/status', authMiddleware, roleMiddleware('merchant', 'admin'), orderController.updateOrderStatus);

export default router;
