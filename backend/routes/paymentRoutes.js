import express from 'express';
import paymentController from '../controllers/paymentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Record payment (buyer only)
router.post('/', authMiddleware, roleMiddleware('buyer'), paymentController.recordPayment);

export default router;
