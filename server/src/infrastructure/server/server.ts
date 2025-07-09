import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { connectToDatabase } from '../database/mongodb';
import { registerAuthRoutes } from '../../adapters/controllers/auth';
import { registerUserRoutes } from '../../adapters/controllers/users';
import { registerTransactionRoutes } from '../../adapters/controllers/transactions';
import { registerBudgetRoutes } from '../../adapters/controllers/budgets';
import { registerCategoryRoutes } from '../../adapters/controllers/categories';

export async function buildServer(): Promise<FastifyInstance> {
  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  // Register plugins
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  });

  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  });

  // Connect to MongoDB
  await connectToDatabase();

  // Register routes
  registerAuthRoutes(server);
  registerUserRoutes(server);
  registerTransactionRoutes(server);
  registerBudgetRoutes(server);
  registerCategoryRoutes(server);

  // Health check route
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  return server;
}

export async function startServer(): Promise<void> {
  const server = await buildServer();
  const port = parseInt(process.env.PORT || '5000', 10);
  const host = process.env.HOST || '0.0.0.0';

  try {
    await server.listen({ port, host });
    server.log.info(`Server listening on ${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
