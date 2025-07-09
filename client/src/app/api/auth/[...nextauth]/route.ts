import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiClient } from '../../../../infrastructure/api/apiClient';

// Extended user type with accessToken
interface AuthenticatedUser extends User {
  accessToken: string;
}

export const authOptions: NextAuthOptions = {
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
          const response = await apiClient<{ user: { id: string; name: string; email: string }; accessToken: string }>(
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Cast user to our extended type
        token.accessToken = (user as AuthenticatedUser).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
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
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
