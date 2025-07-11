import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { connectToDatabase } from '../database/mongodb';
import { registerAuthRoutes } from '../../adapters/controllers/auth';
import { registerUserRoutes } from '../../adapters/controllers/users';
import { registerTransactionRoutes } from '../../adapters/controllers/transactions';
import { registerBudgetRoutes } from '../../adapters/controllers/budgets';
import { registerCategoryRoutes } from '../../adapters/controllers/categories';
import { corsProtection } from '../../adapters/middlewares/auth';

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
    origin: true, // Enable CORS for all origins, but we'll validate in our middleware
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false, // Changed to false to let the CORS plugin handle OPTIONS requests
  });
  
  // Register Swagger
  await server.register(swagger, {
    swagger: {
      info: {
        title: 'Personal Finance Dashboard API',
        description: 'API documentation for Personal Finance Dashboard',
        version: '1.0.0'
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      host: process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL || 'personal-finance-dashboard-4i81.onrender.com' : `${process.env.HOST || 'localhost'}:${process.env.PORT || '5000'}`,
      schemes: process.env.NODE_ENV === 'production' ? ['https', 'http'] : ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Enter the token with the `Bearer: ` prefix, e.g. "Bearer abcde12345"'
        }
      },
      tags: [
        { name: 'auth', description: 'Authentication endpoints' },
        { name: 'users', description: 'User related endpoints' },
        { name: 'transactions', description: 'Transaction related endpoints' },
        { name: 'budgets', description: 'Budget related endpoints' },
        { name: 'categories', description: 'Category related endpoints' }
      ],
    }
  });
  
  // Register Swagger UI
  await server.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  });
  
  // Add global hook for CORS protection on all non-auth routes
  server.addHook('onRequest', async (request, reply) => {
    // Skip CORS protection for authentication routes, documentation, categories, and OPTIONS requests
    if (request.method === 'OPTIONS' || 
        request.url.startsWith('/api/auth/login') || 
        request.url.startsWith('/api/auth/register') || 
        request.url.startsWith('/api/categories') || 
        request.url.startsWith('/documentation') || 
        request.url === '/health') {
      return;
    }
    
    // Apply CORS protection for all other routes
    await corsProtection(request, reply);
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
