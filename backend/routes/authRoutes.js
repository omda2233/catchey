import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [buyer, merchant, delivery, admin]
 *             required: [email, password, role]
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Registration error
 */
router.post('/login', login);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login using Firebase ID token
 *     description: Verifies a Firebase ID token and returns user info
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *             required: [idToken]
  *           example:
  *             idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM4MDI5MzRmZTBlZWM0NmE1ZWQwMDA2ZDE0YTFiYWIwMWUzNDUwODMiLCJ0eXAiOiJKV1QifQ.eyJyb2xlIjoiYnV5ZXIiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vY2F0Y2h5LWZhYnJpYy1tYXJrZXQiLCJ1c2VyX2lkIjoiWElJOUV4SkMwRU5hVkxpMVY5b3JHYUhtWEcyMyIsImlhdCI6MTc2MjcxNzQ2NH0..."
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Invalid token
 */

export default router;
