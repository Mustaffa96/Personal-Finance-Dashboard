import { MongoClient, Db, Collection } from 'mongodb';
import { User } from '../../domain/entities/User';
import { Transaction } from '../../domain/entities/Transaction';
import { Budget } from '../../domain/entities/Budget';
import { Category } from '../../domain/entities/Category';
import { logger } from '../logging/logger';

// Connection URL
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB_NAME || 'finance_dashboard';

// MongoDB client instance
let client: MongoClient | null = null;
let db: Db | null = null;

// Collections
export const collections: {
  users?: Collection<User>;
  transactions?: Collection<Transaction>;
  budgets?: Collection<Budget>;
  categories?: Collection<Category>;
} = {};

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<void> {
  if (client && db) {
    return;
  }

  try {
    client = await MongoClient.connect(url);
    db = client.db(dbName);

    // Initialize collections
    collections.users = db.collection<User>('users');
    collections.transactions = db.collection<Transaction>('transactions');
    collections.budgets = db.collection<Budget>('budgets');
    collections.categories = db.collection<Category>('categories');

    // Create indexes
    await collections.users.createIndex({ email: 1 }, { unique: true });
    await collections.transactions.createIndex({ userId: 1 });
    await collections.transactions.createIndex({ userId: 1, type: 1 });
    await collections.transactions.createIndex({ userId: 1, date: 1 });
    await collections.budgets.createIndex({ userId: 1 });
    await collections.budgets.createIndex({ userId: 1, category: 1 });
    await collections.categories.createIndex({ type: 1 });

    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    throw error;
  }
}

/**
 * Close MongoDB connection
 */
export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    logger.info('MongoDB connection closed');
  }
}

/**
 * Get MongoDB database instance
 */
export function getDb(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectToDatabase() first.');
  }
  return db;
}
