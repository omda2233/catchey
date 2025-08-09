const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Record payment (buyer only)
router.post('/record', authMiddleware, roleMiddleware('buyer'), paymentController.recordPayment);

module.exports = router;