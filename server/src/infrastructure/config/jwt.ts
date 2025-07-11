/**
 * Shared JWT configuration to ensure consistent JWT settings across the application
 */
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// JWT secret key - use environment variable or fallback to a secure default
// IMPORTANT: This must be the same across all environments where tokens are generated or verified
export const JWT_SECRET = process.env.JWT_SECRET || 'personal-finance-dashboard-secure-key-2025';

// Log the first few characters of the secret in development mode for debugging
if (process.env.NODE_ENV !== 'production') {
  console.log(`Using JWT_SECRET: ${JWT_SECRET.substring(0, 5)}...`);
  console.log(`JWT_SECRET source: ${process.env.JWT_SECRET ? 'Environment variable' : 'Default fallback'}`);
}

// Token expiration time
export const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1d';
