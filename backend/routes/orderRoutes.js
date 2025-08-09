const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Place order (buyer only)
router.post('/place', authMiddleware, roleMiddleware('buyer'), orderController.placeOrder);

// Update delivery status (delivery only)
router.put('/delivery-status', authMiddleware, roleMiddleware('delivery'), orderController.updateDeliveryStatus);

// Update order status (seller only)
router.put('/status', authMiddleware, roleMiddleware('seller'), orderController.updateOrderStatus);

module.exports = router;