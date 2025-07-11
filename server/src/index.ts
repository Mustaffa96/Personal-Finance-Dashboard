// Load environment variables from .env file
import * as dotenv from 'dotenv';
dotenv.config();

import { startServer } from './infrastructure/server/server';
import { closeDatabase } from './infrastructure/database/mongodb';
import { logger } from './infrastructure/logging/logger';

// Log environment variable status
logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
logger.info(`MONGODB_URI is ${process.env.MONGODB_URI ? 'set' : 'not set'}`);
logger.info(`MONGODB_DB_NAME is ${process.env.MONGODB_DB_NAME ? 'set' : 'not set'}`);


// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT. Shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM. Shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

// Start the server
startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
