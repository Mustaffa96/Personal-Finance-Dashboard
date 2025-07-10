import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiClient } from '../infrastructure/api/apiClient';
import { cache } from 'react';

// Cache auth requests to prevent redundant network calls
const cachedApiCall = cache(apiClient);

// Define the auth configuration
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await cachedApiCall<{ user: { id: string; name: string; email: string }; accessToken: string }>(
            '/auth/login',
            {
              method: 'POST',
              body: {
                email: credentials.email,
                password: credentials.password,
              },
              requiresAuth: false,
            }
          );

          if (response.user && response.accessToken) {
            return {
              id: response.user.id,
              name: response.user.name,
              email: response.user.email,
              accessToken: response.accessToken,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: { id: string; accessToken: string } | undefined }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: { user: { id?: string }; accessToken?: string }; token: JWT & { id?: string; accessToken?: string } }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
        };
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Improve performance by reducing unnecessary auth checks
  trustHost: true,
  // Prevent LCP inflation in background tabs
  skipWhenNoOnRenderCookies: true,
  secret: process.env.NEXTAUTH_SECRET,
};
