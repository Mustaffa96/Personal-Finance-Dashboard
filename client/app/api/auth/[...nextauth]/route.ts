import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

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
          // Call the backend API
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          // Check if response is OK before trying to parse JSON
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Auth error response:', errorText);
            throw new Error('Authentication failed');
          }
          
          const data = await response.json();
          
          if (!data.success) {
            throw new Error(data.message || 'Authentication failed');
          }
          
          // Return user with token for use in JWT callback
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            token: data.token // Store the token from backend
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user: any }) {
      if (user) {
        // Add user info and backend token to the JWT
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.backendToken = user.token; // Store the backend token
      }
      return token;
    },
    async session({ session, token }: { session: any, token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.backendToken = token.backendToken as string; // Make backend token available to client
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: false,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
