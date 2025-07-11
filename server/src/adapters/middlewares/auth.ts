import { FastifyRequest, FastifyReply } from 'fastify';
import { MongoUserRepository } from '../repositories/UserRepository';

const userRepository = new MongoUserRepository();

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized', message: 'Authentication required' });
  }
}

/**
 * Enhanced CORS middleware that validates requests based on user authentication
 * This provides an additional layer of security by checking the origin against allowed origins
 */
export async function corsProtection(request: FastifyRequest, reply: FastifyReply) {
  const origin = request.headers.origin;
  
  // Allow preflight requests
  if (request.method === 'OPTIONS') {
    return;
  }
  
  // Skip CORS check for authentication routes
  const authRoutes = ['/api/auth/login', '/api/auth/register'];
  if (authRoutes.includes(request.url)) {
    return;
  }
  
  try {
    // Verify JWT token
    await request.jwtVerify();
    
    // Get user ID from token
    const { userId } = request.user as { userId: string };
    
    // Get user from database
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if origin is allowed using user-specific allowed origins
    let allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001', 'https://personal-finance-dashboard-client.vercel.app'];
    
    // Use user-specific allowed origins if available
    if (user.allowedOrigins && user.allowedOrigins.length > 0) {
      // Combine default origins with user-specific origins
      allowedOrigins = [...allowedOrigins, ...user.allowedOrigins];
    }
    
    // Add role-based origins
    if (user.role === 'admin') {
      const adminOrigins = process.env.ADMIN_CORS_ORIGIN?.split(',') || [];
      allowedOrigins = [...allowedOrigins, ...adminOrigins];
    }
    
    // Log for debugging (remove in production)
    request.log.debug(`Request from origin: ${origin}, Allowed origins: ${allowedOrigins.join(', ')}`);
    
    // Extract just the origin part (scheme + hostname + port) without any path
    const originWithoutPath = origin ? new URL(origin).origin : null;
    
    // Check if the origin (without path) is in our allowed origins list
    if (originWithoutPath && !allowedOrigins.some(allowed => originWithoutPath.startsWith(allowed))) {
      request.log.warn(`Access denied for origin: ${origin} for user: ${userId}`);
      throw new Error('Origin not allowed');
    }
    
  } catch (err) {
    // Don't expose detailed error information
    reply.status(403).send({ error: 'Forbidden', message: 'Access denied' });
  }
}
