import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());

// Simple logging middleware for mutating requests
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    try {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} body=`, req.body);
    } catch (_) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    }
  }
  next();
});

// Mount routes
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'Catchy Fabric Market Backend' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use(errorHandler);

export default app;
