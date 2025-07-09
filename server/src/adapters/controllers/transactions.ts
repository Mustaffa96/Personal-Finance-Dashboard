import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { MongoTransactionRepository } from '../repositories/TransactionRepository';
import { TransactionSchema, TransactionType } from '../../domain/entities/Transaction';
import { authenticate } from '../middlewares/auth';

const transactionRepository = new MongoTransactionRepository();

// Request schemas
const createTransactionSchema = TransactionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const updateTransactionSchema = TransactionSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

const dateRangeSchema = z.object({
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
});

export function registerTransactionRoutes(server: FastifyInstance) {
  // Get all transactions for a user
  server.get('/api/transactions', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = request.user as { userId: string };
      const query = request.query as Record<string, string>;
      
      // Filter by type if provided
      if (query.type && Object.values(TransactionType).includes(query.type as TransactionType)) {
        const transactions = await transactionRepository.findByUserIdAndType(
          userId,
          query.type as TransactionType
        );
        return reply.status(200).send(transactions);
      }
      
      // Filter by date range if provided
      if (query.startDate && query.endDate) {
        try {
          const { startDate, endDate } = dateRangeSchema.parse({
            startDate: query.startDate,
            endDate: query.endDate,
          });
          
          const transactions = await transactionRepository.findByDateRange(
            userId,
            startDate,
            endDate
          );
          return reply.status(200).send(transactions);
        } catch (error) {
          return reply.status(400).send({
            error: 'Invalid date range',
            message: 'Start date and end date must be valid dates',
          });
        }
      }
      
      // Get all transactions if no filters
      const transactions = await transactionRepository.findByUserId(userId);
      return reply.status(200).send(transactions);
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
  
  // Get transaction by ID
  server.get('/api/transactions/:id', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { userId } = request.user as { userId: string };
      
      const transaction = await transactionRepository.findById(id);
      
      if (!transaction) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'Transaction not found',
        });
      }
      
      // Ensure user can only access their own transactions
      if (transaction.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You can only access your own transactions',
        });
      }
      
      return reply.status(200).send(transaction);
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
  
  // Create transaction
  server.post('/api/transactions', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = request.user as { userId: string };
      const body = request.body as Record<string, unknown>;
      
      // Validate request body
      const validatedData = createTransactionSchema.parse({
        ...body,
        userId,
        date: new Date(body.date as string),
      });
      
      const transaction = await transactionRepository.create(validatedData);
      
      return reply.status(201).send(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        });
      }
      
      server.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
  
  // Update transaction
  server.put('/api/transactions/:id', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { userId } = request.user as { userId: string };
      const body = request.body as Record<string, unknown>;
      
      // Check if transaction exists and belongs to user
      const existingTransaction = await transactionRepository.findById(id);
      if (!existingTransaction) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'Transaction not found',
        });
      }
      
      if (existingTransaction.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You can only update your own transactions',
        });
      }
      
      // Validate request body
      const validatedData = updateTransactionSchema.parse({
        ...body,
        date: body.date ? new Date(body.date as string) : undefined,
      });
      
      const updatedTransaction = await transactionRepository.update(id, validatedData);
      
      return reply.status(200).send(updatedTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        });
      }
      
      server.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
  
  // Delete transaction
  server.delete('/api/transactions/:id', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { userId } = request.user as { userId: string };
      
      // Check if transaction exists and belongs to user
      const existingTransaction = await transactionRepository.findById(id);
      if (!existingTransaction) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'Transaction not found',
        });
      }
      
      if (existingTransaction.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You can only delete your own transactions',
        });
      }
      
      await transactionRepository.delete(id);
      
      return reply.status(204).send();
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
}
