import express from 'express';
import paymentController from '../controllers/paymentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment recording for orders
 */

/**
 * @swagger
 * /api/payments:
  *   post:
  *     summary: Record payment for an order (buyer only)
  *     tags: [Payments]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - in: header
  *         name: Authorization
  *         description: Use the Authorize button or provide `Bearer <idToken>`
  *         schema:
  *           type: string
  *         example: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4MDI5MzRmZTBlZWM0NmE1ZWQwMDA2ZDE0YTFiYWIwMWUzNDUwODMiLCJ0eXAiOiJKV1QifQ.eyJyb2xlIjoiYnV5ZXIiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2F0Y2h5LWZhYnJpYy1tYXJrZXQiLCJ1c2VyX2lkIjoiWElJOUV4SkMwRU5hVkxpMVY5b3JHYUhtWEcyMyIsImlhdCI6MTc2MjcxNzQ2NH0..."
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               orderId:
  *                 type: string
  *               method:
  *                 type: string
  *                 enum: [instapay, card]
  *               instapayNumber:
  *                 type: string
  *               cardNumber:
  *                 type: string
  *               expiryDate:
  *                 type: string
  *               amount:
  *                 type: number
  *             required: [orderId, method, amount]
  *           examples:
  *             card:
  *               value:
  *                 orderId: g0QyaYJKEND7sXsbHZ2O
  *                 method: card
  *                 cardNumber: 4111111111111111
  *                 expiryDate: 12/34
  *                 cvv: 123
  *                 amount: 200
  *             instapay:
  *               value:
  *                 orderId: g0QyaYJKEND7sXsbHZ2O
  *                 method: instapay
  *                 instapayNumber: 01112223334
  *                 amount: 200
 *     responses:
 *       200:
 *         description: Payment recorded successfully
 *       400:
 *         description: Invalid payment data
 *       403:
 *         description: Unauthorized role
 *       404:
 *         description: Order not found
 */
// Record payment (buyer only)
router.post('/', authMiddleware, roleMiddleware('buyer'), paymentController.recordPayment);

export default router;
