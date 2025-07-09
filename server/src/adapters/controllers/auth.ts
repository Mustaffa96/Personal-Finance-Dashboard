import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { MongoUserRepository } from '../repositories/UserRepository';
import { AuthService } from '../../domain/services/AuthService';
import { UserSchema } from '../../domain/entities/User';

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
  server.post('/api/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as z.infer<typeof loginSchema>;
      
      // Validate request body
      const validatedData = loginSchema.parse(body);
      
      // Authenticate user
      const user = await authService.validateUser({
        email: validatedData.email,
        password: validatedData.password,
      });
      
      if (!user) {
        return reply.status(401).send({
          error: 'Authentication failed',
          message: 'Invalid email or password',
        });
      }
      
      // Generate JWT token
      const accessToken = authService.generateToken(user.id!);
      
      return reply.status(200).send({
        user,
        accessToken,
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
  
  // Register route
  server.post('/api/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as z.infer<typeof registerSchema>;
      
      // Validate request body
      const validatedData = registerSchema.parse(body);
      
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(validatedData.email);
      if (existingUser) {
        return reply.status(409).send({
          error: 'Registration failed',
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
      const accessToken = authService.generateToken(user.id!);
      
      return reply.status(201).send({
        user: userWithoutPassword,
        accessToken,
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
  
  // Verify token route
  server.get('/api/auth/me', {
    preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({
          error: 'Unauthorized',
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
          error: 'User not found',
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
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      });
    }
  });
}
