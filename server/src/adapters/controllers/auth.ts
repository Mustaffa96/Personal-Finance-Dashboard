import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { MongoUserRepository } from '../repositories/UserRepository';
import { AuthService } from '../../domain/services/AuthService';
import { UserSchema } from '../../domain/entities/User';
import { loginRequestSchema, registerRequestSchema } from '../../infrastructure/swagger/schemas';

const userRepository = new MongoUserRepository();
const authService = new AuthService(userRepository);

// Request schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
});

export function registerAuthRoutes(server: FastifyInstance) {
  // Login route
  server.post('/api/auth/login', {
    schema: loginRequestSchema
    // We don't need config here as auth is handled by our global hooks
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Log incoming login request (without sensitive data)
      server.log.info(`Login attempt for email: ${(request.body as any)?.email || 'unknown'}`);
      
      const body = request.body as z.infer<typeof loginSchema>;
      
      // Validate request body
      const validatedData = loginSchema.parse(body);
      
      // Authenticate user
      const user = await authService.validateUser({
        email: validatedData.email,
        password: validatedData.password,
      });
      
      if (!user) {
        server.log.info(`Failed login attempt for email: ${validatedData.email}`);
        return reply
          .status(401)
          .header('Access-Control-Allow-Origin', request.headers.origin || '*')
          .header('Access-Control-Allow-Credentials', 'true')
          .send({
            message: 'Invalid email or password',
          });
      }
      
      // Generate JWT token
      const token = authService.generateToken(user.id!);
      
      server.log.info(`Successful login for user: ${user.email}`);
      
      return reply
        .status(200)
        .header('Access-Control-Allow-Origin', request.headers.origin || '*')
        .header('Access-Control-Allow-Credentials', 'true')
        .send({
          user,
          token,
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'Validation error',
          details: error.errors,
        });
      }
      
      server.log.error(error);
      return reply.status(500).send({
        message: 'An unexpected error occurred',
      });
    }
  });
  
  // Register route
  server.post('/api/auth/register', {
    schema: registerRequestSchema
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as z.infer<typeof registerSchema>;
      
      // Validate request body
      const validatedData = registerSchema.parse(body);
      
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(validatedData.email);
      if (existingUser) {
        return reply.status(409).send({
          message: 'Email already in use',
        });
      }
      
      // Create new user
      const user = await userRepository.create({
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
      });
      
      // Remove password from response
      const { password: _password, ...userWithoutPassword } = user;
      
      // Generate JWT token
      const token = authService.generateToken(user.id!);
      
      return reply.status(201).send({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: 'Validation error',
          details: error.errors,
        });
      }
      
      server.log.error(error);
      return reply.status(500).send({
        message: 'An unexpected error occurred',
      });
    }
  });
  
  // Verify token route
  server.get('/api/auth/me', {
    schema: {
      description: 'Get current user information',
      tags: ['auth'],
      summary: 'Get the authenticated user profile',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'User information',
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    },
    preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({
          message: 'Invalid or expired token',
        });
      }
    },
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = request.user as { userId: string };
      
      const user = await userRepository.findById(userId);
      if (!user) {
        return reply.status(404).send({
          message: 'User no longer exists',
        });
      }
      
      // Remove password from response
      const { password: _password, ...userWithoutPassword } = user;
      
      return reply.status(200).send({
        user: userWithoutPassword,
      });
    } catch (error) {
      server.log.error(error);
      return reply.status(500).send({
        message: 'An unexpected error occurred',
      });
    }
  });
}
