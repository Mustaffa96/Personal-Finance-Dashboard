import NextAuth from 'next-auth/next';
import { authOptions } from '../../../../lib/auth-options';

// Export the NextAuth handlers for the API route
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
