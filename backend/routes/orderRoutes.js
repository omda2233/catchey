import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Buyer, delivery, and merchant order operations
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: List orders (role-based filtering)
 *     description: Returns orders based on the caller's role.
 *       - Buyer: only their own orders
 *       - Merchant: only their shop's orders
 *       - Delivery: orders assigned to them
 *       - Admin: all orders
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Use the Authorize button or provide `Bearer <idToken>`
 *         schema:
 *           type: string
 *         example: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4MDI5MzRmZTBlZWM0NmE1ZWQwMDA2ZDE0YTFiYWIwMWUzNDUwODMiLCJ0eXAiOiJKV1QifQ..."
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       buyerId:
 *                         type: string
 *                       merchantId:
 *                         type: string
 *                       deliveryId:
 *                         type: string
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                       amount:
 *                         type: number
 *                       status:
 *                         type: string
 *                       paymentStatus:
 *                         type: string
 *             examples:
 *               buyer:
 *                 value:
 *                   success: true
 *                   orders:
 *                     - id: Abc123
 *                       buyerId: XIS9ExJC0ENaVLi1V9orGaHmXG23
 *                       merchantId: sX9uV0LYXAQuNvgdmFdQ9cUgMQQ2
 *                       deliveryId: D4IsEfy6PUYn4FRZjwjXAwJ4X0P2
 *                       items:
 *                         - productId: demo-product-1
 *                           quantity: 2
 *                       amount: 200
 *                       status: processing
 *                       paymentStatus: paid
 *       403:
 *         description: Unauthorized role
 */
// List orders (role-based)
router.get('/', authMiddleware, roleMiddleware('buyer', 'merchant', 'delivery', 'admin'), orderController.listOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order (buyer only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
  *     parameters:
  *       - in: header
  *         name: Authorization
  *         description: Use the Authorize button or provide `Bearer <idToken>`
  *         schema:
  *           type: string
  *         example: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4MDI5MzRmZTBlZWM0NmE1ZWQwMDA2ZDE0YTFiYWIwMWUzNDUwODMiLCJ0eXAiOiJKV1QifQ.eyJyb2xlIjoiYnV5ZXIiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2F0Y2h5LWZhYnJpYy1tYXJrZXQiLCJhdWQiOiJjYXRjaHktZmFicmljLW1hcmtldCIsImF1dGhfdGltZSI6MTc2MjcxNzQ2NCwidXNlcl9pZCI6IlhJSTlFeEpDMEVOYVZMaTFWOW9yR2FIbVhHMjMiLCJzdWIiOiJYSUk5RXhKQzBFTmFWTGkxVjlvckdhSG1YRzIzIiwiaWF0IjoxNzYyNzE3NDY0LCJleHAiOjE3NjI3MjEwNjQsImVtYWlsIjoiYnV5ZXJAdGVzdC5jb20ifQ..."
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               items:
  *                 type: array
  *                 items:
  *                   type: object
  *               merchantId:
  *                 type: string
  *               deliveryId:
  *                 type: string
  *                 nullable: true
  *               amount:
  *                 type: number
  *             required: [items, merchantId, amount]
  *           example:
  *             items:
  *               - productId: demo-product-1
  *                 quantity: 2
  *             merchantId: sX9uV0LYXAQuNvgdmFdQ9cUgMQQ2
  *             deliveryId: D4IsEfy6PUYn4FRZjwjXAwJ4X0P2
  *             amount: 200
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orderId:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Unauthorized role
 */
// Place order (buyer only)
router.post('/', authMiddleware, roleMiddleware('buyer'), orderController.placeOrder);

/**
 * @swagger
 * /api/orders/{id}/delivery-status:
  *   put:
  *     summary: Update delivery status (delivery only)
  *     tags: [Orders]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *       - in: header
  *         name: Authorization
  *         description: Use the Authorize button or provide `Bearer <idToken>`
  *         schema:
  *           type: string
  *         example: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4MDI5MzRmZTBlZWM0NmE1ZWQwMDA2ZDE0YTFiYWIwMWUzNDUwODMiLCJ0eXAiOiJKV1QifQ.eyJyb2xlIjoic2hpcHBpbmciLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2F0Y2h5LWZhYnJpYy1tYXJrZXQiLCJhdWQiOiJjYXRjaHktZmFicmljLW1hcmtldCIsInVzZXJfaWQiOiJENElzRWZ5NlBVWW40RlJaandqWEF3SjRYMFAyIiwiaWF0IjoxNzYyNzE3NDg1fQ..."
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               deliveryStatus:
  *                 type: string
  *             required: [deliveryStatus]
  *           example:
  *             deliveryStatus: in_transit
 *     responses:
 *       200:
 *         description: Delivery status updated
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Unauthorized role or order
 *       404:
 *         description: Order not found
 */
// Update delivery status (delivery only)
router.put('/:id/delivery-status', authMiddleware, roleMiddleware('delivery'), orderController.updateDeliveryStatus);

/**
 * @swagger
 * /api/orders/{id}/status:
  *   put:
  *     summary: Update order status (merchant or admin)
  *     tags: [Orders]
  *     security:
  *       - BearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *       - in: header
  *         name: Authorization
  *         description: Use the Authorize button or provide `Bearer <idToken>`
  *         schema:
  *           type: string
  *         example: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4MDI5MzRmZTBlZWM0NmE1ZWQwMDA2ZDE0YTFiYWIwMWUzNDUwODMiLCJ0eXAiOiJKV1QifQ.eyJyb2xlIjoic2VsbGVyIiwidXNlcl9pZCI6InNYOXVWMExZWEE..."
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               status:
  *                 type: string
  *             required: [status]
  *           examples:
  *             seller:
  *               value:
  *                 status: processing
  *             admin:
  *               value:
  *                 status: completed
 *     responses:
 *       200:
 *         description: Order status updated
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Unauthorized role or order
 *       404:
 *         description: Order not found
 */
// Update order status (merchant or admin)
router.put('/:id/status', authMiddleware, roleMiddleware('merchant', 'admin'), orderController.updateOrderStatus);

export default router;
