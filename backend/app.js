import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import admin from './firebaseAdmin.js';

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
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

app.get("/api/test/firebase", async (req, res) => { 
  try { 
    const db = admin.firestore(); 
    const testRef = db.collection("test").doc("connection"); 
    await testRef.set({ timestamp: new Date().toISOString() }); 
    const doc = await testRef.get(); 
    res.json({ 
      firebase: "connected", 
      data: doc.data(), 
      domain: "https://catchey-copy-copy-production.up.railway.app/" 
    }); 
  } catch (error) { 
    res.status(500).json({ firebase: "error", details: error.message }); 
  } 
});

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
