import { FastifyRequest, FastifyReply } from 'fastify';
import { MongoUserRepository } from '../repositories/UserRepository';

const userRepository = new MongoUserRepository();

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }
    
    // Log token format for debugging (only in development)
    if (process.env.NODE_ENV !== 'production') {
      request.log.debug(`Auth header format: ${authHeader.substring(0, 15)}...`);
    }
    
    // Verify JWT token
    await request.jwtVerify();
  } catch (err) {
    request.log.error(`Authentication error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    reply.status(401).send({ error: 'Unauthorized', message: 'Authentication required' });
  }
}

/**
 * Enhanced CORS middleware that validates requests based on user authentication
 * This provides an additional layer of security by checking the origin against allowed origins
 * Note: This middleware should only be applied to authenticated routes
 */
export async function corsProtection(request: FastifyRequest, reply: FastifyReply) {
  const origin = request.headers.origin;
  
  // Allow preflight requests
  if (request.method === 'OPTIONS') {
    return;
  }
  
  // Skip CORS check for authentication routes
  const authRoutes = ['/api/auth/login', '/api/auth/register'];
  if (authRoutes.some(route => request.url.startsWith(route))) {
    return;
  }
  
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      request.log.warn('No authorization header provided');
      request.log.warn(`Request URL: ${request.url}, Method: ${request.method}`);
      throw new Error('No authorization header provided');
    }
    
    // Log token format for debugging (only in development)
    if (process.env.NODE_ENV !== 'production') {
      request.log.debug(`Auth header format: ${authHeader.substring(0, 15)}...`);
      request.log.debug(`Request URL: ${request.url}, Method: ${request.method}`);
      request.log.debug(`Request query: ${JSON.stringify(request.query)}`);
    }
    
    try {
      // Verify JWT token
      await request.jwtVerify();
    } catch (jwtError) {
      request.log.error(`JWT verification error: ${jwtError instanceof Error ? jwtError.message : 'Unknown error'}`);
      request.log.error(`Token: ${authHeader.substring(0, 20)}...`); // Log part of the token for debugging
      throw new Error(`JWT verification failed: ${jwtError instanceof Error ? jwtError.message : 'Unknown error'}`);
    }
    
    // Get user ID from token
    if (!request.user || typeof request.user !== 'object') {
      request.log.error('Invalid token payload: user object missing');
      request.log.error(`Token payload: ${JSON.stringify(request.user)}`); // Log the token payload
      throw new Error('Invalid token payload');
    }
    
    const { userId } = request.user as { userId: string };
    if (!userId) {
      request.log.error('Invalid token payload: userId missing');
      request.log.error(`Token payload: ${JSON.stringify(request.user)}`); // Log the token payload
      throw new Error('Invalid token payload: userId missing');
    }
    
    // Get user from database
    const user = await userRepository.findById(userId);
    if (!user) {
      request.log.warn(`User not found: ${userId}`);
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
    
    // Log for debugging
    request.log.debug(`Request from origin: ${origin}, Allowed origins: ${allowedOrigins.join(', ')}`);
    
    // If no origin header is present, allow the request (likely a direct API call)
    if (!origin) {
      request.log.debug('No origin header present, allowing request');
      return;
    }
    
    try {
      // Extract just the origin part (scheme + hostname + port) without any path
      const originWithoutPath = new URL(origin).origin;
      
      // Check if the origin is allowed - more permissive check
      const isAllowed = allowedOrigins.some(allowed => {
        // Handle localhost special case
        if (allowed.includes('localhost') && originWithoutPath.includes('localhost')) {
          return true;
        }
        return originWithoutPath.startsWith(allowed) || allowed.includes(originWithoutPath);
      });
      
      if (!isAllowed) {
        request.log.warn(`Access denied for origin: ${origin} for user: ${userId}`);
        throw new Error('Origin not allowed');
      }
    } catch (urlError) {
      // If URL parsing fails, log it but don't block the request
      // This is a more permissive approach for development
      request.log.warn(`Invalid origin format: ${origin}, allowing request`);
    }
    
  } catch (err) {
    // Log the actual error for debugging
    request.log.error(`CORS protection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    request.log.error(`Request URL: ${request.url}, Method: ${request.method}`);
    request.log.error(`Request headers: ${JSON.stringify(request.headers)}`);
    
    // In development mode, be more permissive
    if (process.env.NODE_ENV !== 'production') {
      request.log.warn('Development mode: Allowing request despite auth error');
      return; // Allow the request to proceed in development
    }
    
    // Don't expose detailed error information in response
    reply.status(403).send({ error: 'Forbidden', message: 'Access denied' });
  }
}
