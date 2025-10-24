import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Place order (buyer only)
router.post('/place', authMiddleware, roleMiddleware('buyer'), orderController.placeOrder);

// Update delivery status (delivery only)
router.put('/delivery-status', authMiddleware, roleMiddleware('delivery'), orderController.updateDeliveryStatus);

// Update order status (seller only)
router.put('/status', authMiddleware, roleMiddleware('seller'), orderController.updateOrderStatus);

export default router;
