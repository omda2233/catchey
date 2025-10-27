import express from 'express';
import bodyParser from 'body-parser';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

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
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'Catchy Fabric Market Backend' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

export default app;
