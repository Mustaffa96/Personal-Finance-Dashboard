import 'dotenv/config';
import { startServer } from './infrastructure/server/server';
import { closeDatabase } from './infrastructure/database/mongodb';
import { logger } from './infrastructure/logging/logger';

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
