import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { MongoUserRepository } from '../repositories/UserRepository';
import { UserSchema } from '../../domain/entities/User';
import { authenticate } from '../middlewares/auth';

const userRepository = new MongoUserRepository();

// Request schemas
const updateUserSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
}).partial();

// Schema for updating allowed origins
const updateAllowedOriginsSchema = z.object({
  allowedOrigins: z.array(z.string().url('Invalid URL format')),
});

export function registerUserRoutes(server: FastifyInstance) {
  // Get user by ID
  server.get('/api/users/:id', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { userId } = request.user as { userId: string };
      
      // Only allow users to access their own data
      if (id !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You can only access your own user data',
        });
      }
      
      const user = await userRepository.findById(id);
      if (!user) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'User not found',
        });
      }
      
      // Remove password from response
      const { password: _password, ...userWithoutPassword } = user;
      
      return reply.status(200).send(userWithoutPassword);
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
  
  // Update user
  server.put('/api/users/:id', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { userId } = request.user as { userId: string };
      const body = request.body as z.infer<typeof updateUserSchema>;
      
      // Only allow users to update their own data
      if (id !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You can only update your own user data',
        });
      }
      
      // Validate request body
      const validatedData = updateUserSchema.parse(body);
      
      // If email is being updated, check if it's already in use
      if (validatedData.email) {
        const existingUser = await userRepository.findByEmail(validatedData.email);
        if (existingUser && existingUser.id !== id) {
          return reply.status(409).send({
            error: 'Update failed',
            message: 'Email already in use',
          });
        }
      }
      
      const updatedUser = await userRepository.update(id, validatedData);
      if (!updatedUser) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'User not found',
        });
      }
      
      // Remove password from response
      const { password: _password, ...userWithoutPassword } = updatedUser;
      
      return reply.status(200).send(userWithoutPassword);
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
  
  // Delete user
  server.delete('/api/users/:id', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { userId } = request.user as { userId: string };
      
      // Only allow users to delete their own account
      if (id !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You can only delete your own account',
        });
      }
      
      const deleted = await userRepository.delete(id);
      if (!deleted) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'User not found',
        });
      }
      
      return reply.status(204).send();
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
  
  // Update allowed origins for CORS protection
  server.put('/api/users/:id/allowed-origins', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { userId } = request.user as { userId: string };
      const body = request.body as z.infer<typeof updateAllowedOriginsSchema>;
      
      // Only allow users to update their own allowed origins
      if (id !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You can only update your own allowed origins',
        });
      }
      
      // Validate request body
      const validatedData = updateAllowedOriginsSchema.parse(body);
      
      // Update user with new allowed origins
      const updatedUser = await userRepository.update(id, {
        allowedOrigins: validatedData.allowedOrigins,
      });
      
      if (!updatedUser) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'User not found',
        });
      }
      
      // Remove password from response
      const { password: _password, ...userWithoutPassword } = updatedUser;
      
      return reply.status(200).send({
        message: 'Allowed origins updated successfully',
        user: userWithoutPassword,
      });
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
  
  // Get allowed origins
  server.get('/api/users/:id/allowed-origins', {
    preHandler: authenticate,
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const { userId } = request.user as { userId: string };
      
      // Only allow users to get their own allowed origins
      if (id !== userId) {
        return reply.status(403).send({
          error: 'Forbidden',
          message: 'You can only view your own allowed origins',
        });
      }
      
      const user = await userRepository.findById(id);
      if (!user) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'User not found',
        });
      }
      
      return reply.status(200).send({
        allowedOrigins: user.allowedOrigins || [],
      });
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
}
