import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { MongoCategoryRepository } from '../repositories/CategoryRepository';
import { CategorySchema, CategoryType } from '../../domain/entities/Category';
import { authenticate } from '../middlewares/auth';

const categoryRepository = new MongoCategoryRepository();

// Request schemas
const createCategorySchema = CategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const updateCategorySchema = CategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export function registerCategoryRoutes(server: FastifyInstance) {
  // Get all categories
  server.get('/api/categories', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const query = request.query as { type?: string };
      
      // Filter by type if provided
      if (query.type) {
        // Check if the query type is a valid CategoryType
        const isValidType = Object.values(CategoryType).includes(query.type as CategoryType);
        
        if (isValidType) {
          // Safe conversion since we've validated it's a valid enum value
          const categoryType = query.type as CategoryType;
          const categories = await categoryRepository.findByType(categoryType);
          return reply.status(200).send(categories);
        }
      }
      
      // Get all categories if no filters
      const categories = await categoryRepository.findAll();
      return reply.status(200).send(categories);
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
  
  // Get category by ID
  server.get('/api/categories/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      
      const category = await categoryRepository.findById(id);
      
      if (!category) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'Category not found',
        });
      }
      
      return reply.status(200).send(category);
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
  
  // Create category (admin only)
  server.post('/api/categories', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { isAdmin } = request.user as { userId: string, isAdmin?: boolean };
      
      // Only allow admins to create categories
      if (!isAdmin) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'Only administrators can create categories',
        });
      }
      
      const body = request.body as z.infer<typeof createCategorySchema>;
      
      // Validate request body
      const validatedData = createCategorySchema.parse(body);
      
      const category = await categoryRepository.create(validatedData);
      
      return reply.status(201).send(category);
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
  
  // Update category (admin only)
  server.put('/api/categories/:id', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { isAdmin } = request.user as { userId: string, isAdmin?: boolean };
      
      // Only allow admins to update categories
      if (!isAdmin) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'Only administrators can update categories',
        });
      }
      
      // Check if category exists
      const existingCategory = await categoryRepository.findById(id);
      if (!existingCategory) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'Category not found',
        });
      }
      
      const body = request.body as z.infer<typeof updateCategorySchema>;
      
      // Validate request body
      const validatedData = updateCategorySchema.parse(body);
      
      const updatedCategory = await categoryRepository.update(id, validatedData);
      
      return reply.status(200).send(updatedCategory);
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
  
  // Delete category (admin only)
  server.delete('/api/categories/:id', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { isAdmin } = request.user as { userId: string, isAdmin?: boolean };
      
      // Only allow admins to delete categories
      if (!isAdmin) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'Only administrators can delete categories',
        });
      }
      
      // Check if category exists
      const existingCategory = await categoryRepository.findById(id);
      if (!existingCategory) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'Category not found',
        });
      }
      
      await categoryRepository.delete(id);
      
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
