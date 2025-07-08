import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.js';
import { transactionRoutes } from './routes/transactions.js';
import { budgetRoutes } from './routes/budgets.js';
import { userRoutes } from './routes/users.js';

// Load environment variables
dotenv.config();

// Create Hono app
const app = new Hono();

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', process.env.CLIENT_URL || '*'],
    credentials: true,
  })
);

// Health check route
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    message: 'Personal Finance Dashboard API is running',
    version: '1.0.0',
  });
});

// API routes
app.route('/api/auth', authRoutes);
app.route('/api/transactions', transactionRoutes);
app.route('/api/budgets', budgetRoutes);
app.route('/api/users', userRoutes);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/finance-dashboard';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const port = process.env.PORT || 5000;
console.log(`Server starting on port ${port}...`);

connectDB().then(() => {
  serve({
    fetch: app.fetch,
    port: Number(port),
  });
  console.log(`Server is running on port ${port}`);
});
