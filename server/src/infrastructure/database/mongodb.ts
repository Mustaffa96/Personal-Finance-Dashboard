import { MongoClient, Db, Collection, MongoClientOptions } from 'mongodb';
import { User } from '../../domain/entities/User';
import { Transaction } from '../../domain/entities/Transaction';
import { Budget } from '../../domain/entities/Budget';
import { Category } from '../../domain/entities/Category';
import { logger } from '../logging/logger';

// Connection URL with fallback to localhost if MONGODB_URI is not defined
logger.info(`MONGODB_URI environment variable is ${process.env.MONGODB_URI ? 'set' : 'not set'}`); 

// Parse the MongoDB URI to separate the connection string from query parameters
let url = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Remove any query parameters from the URL as they'll be passed as options
if (url.includes('?')) {
  url = url.split('?')[0];
  logger.info('Removed query parameters from MongoDB URI');
}

const dbName = process.env.MONGODB_DB_NAME || 'finance_dashboard';
logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
logger.info(`MONGODB_URI is ${process.env.MONGODB_URI ? 'set' : 'not set'}`);
logger.info(`MONGODB_DB_NAME is ${process.env.MONGODB_DB_NAME ? 'set' : 'not set'}`);

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
    // Define connection options
    const options: MongoClientOptions = {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 10,
      minPoolSize: 5
    };

    logger.info(`Connecting to MongoDB at ${url}`);
    client = await MongoClient.connect(url, options);
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
    await collections.budgets.createIndex({ userId: 1, categoryId: 1 });
    await collections.categories.createIndex({ type: 1 });

    logger.info('Successfully connected to MongoDB');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    if (error instanceof Error) {
      logger.error(`Error message: ${error.message}`);
      if (error.stack) {
        logger.error(`Stack trace: ${error.stack}`);
      }
    }
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
