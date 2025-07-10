import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { MongoBudgetRepository } from '../repositories/BudgetRepository';
import { BudgetSchema } from '../../domain/entities/Budget';

import { authenticate } from '../middlewares/auth';

const budgetRepository = new MongoBudgetRepository();

// Request schemas
const createBudgetSchema = BudgetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const updateBudgetSchema = BudgetSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export function registerBudgetRoutes(server: FastifyInstance) {
  // Get all budgets for a user
  server.get('/api/budgets', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = request.user as { userId: string };
      const query = request.query as { active?: string; categoryId?: string };
      
      // Filter by active status if provided
      if (query.active === 'true') {
        const currentDate = new Date();
        const budgets = await budgetRepository.findActive(userId, currentDate);
        return reply.status(200).send(budgets);
      }
      
      // Filter by categoryId if provided
      if (query.categoryId) {
        const budget = await budgetRepository.findByUserIdAndCategoryId(
          userId,
          query.categoryId
        );
        return reply.status(200).send(budget ? [budget] : []);
      }
      
      // Get all budgets if no filters
      const budgets = await budgetRepository.findByUserId(userId);
      return reply.status(200).send(budgets);
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
  
  // Get budget by ID
  server.get('/api/budgets/:id', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { userId } = request.user as { userId: string };
      
      const budget = await budgetRepository.findById(id);
      
      if (!budget) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'Budget not found',
        });
      }
      
      // Ensure user can only access their own budgets
      if (budget.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You can only access your own budgets',
        });
      }
      
      return reply.status(200).send(budget);
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
  
  // Create budget
  server.post('/api/budgets', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = request.user as { userId: string };
      const body = request.body as Record<string, unknown>;
      
      // Validate request body
      const validatedData = createBudgetSchema.parse({
        ...body,
        userId,
        startDate: new Date(body.startDate as string),
        endDate: new Date(body.endDate as string),
      });
      
      // Check if start date is before end date
      if (validatedData.startDate >= validatedData.endDate) {
        return reply.status(400).send({
          error: 'Validation error',
          message: 'Start date must be before end date',
        });
      }
      
      const budget = await budgetRepository.create(validatedData);
      
      return reply.status(201).send(budget);
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
  
  // Update budget
  server.put('/api/budgets/:id', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { userId } = request.user as { userId: string };
      const body = request.body as Record<string, unknown>;
      
      // Check if budget exists and belongs to user
      const existingBudget = await budgetRepository.findById(id);
      if (!existingBudget) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'Budget not found',
        });
      }
      
      if (existingBudget.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You can only update your own budgets',
        });
      }
      
      // Validate request body
      const updateData: Partial<z.infer<typeof updateBudgetSchema>> = { ...body };
      if (body.startDate) updateData.startDate = new Date(body.startDate as string);
      if (body.endDate) updateData.endDate = new Date(body.endDate as string);
      
      const validatedData = updateBudgetSchema.parse(updateData);
      
      // Check date consistency if both dates are provided
      if (validatedData.startDate && validatedData.endDate) {
        if (validatedData.startDate >= validatedData.endDate) {
          return reply.status(400).send({
            error: 'Validation error',
            message: 'Start date must be before end date',
          });
        }
      } else if (validatedData.startDate && !validatedData.endDate) {
        // Check if new start date is before existing end date
        if (validatedData.startDate >= existingBudget.endDate) {
          return reply.status(400).send({
            error: 'Validation error',
            message: 'Start date must be before end date',
          });
        }
      } else if (!validatedData.startDate && validatedData.endDate) {
        // Check if existing start date is before new end date
        if (existingBudget.startDate >= validatedData.endDate) {
          return reply.status(400).send({
            error: 'Validation error',
            message: 'Start date must be before end date',
          });
        }
      }
      
      const updatedBudget = await budgetRepository.update(id, validatedData);
      
      return reply.status(200).send(updatedBudget);
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
  
  // Delete budget
  server.delete('/api/budgets/:id', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { userId } = request.user as { userId: string };
      
      // Check if budget exists and belongs to user
      const existingBudget = await budgetRepository.findById(id);
      if (!existingBudget) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'Budget not found',
        });
      }
      
      if (existingBudget.userId !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You can only delete your own budgets',
        });
      }
      
      await budgetRepository.delete(id);
      
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
