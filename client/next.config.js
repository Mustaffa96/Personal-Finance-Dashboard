/** @type {import('next').NextConfig} */

// Set NextAuth URL based on the port the application is running on
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3001';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      // Handle all API routes except NextAuth routes
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:5000/api/:path*' 
          : '/api/:path*',
        // Exclude NextAuth routes using a condition on the path parameter
        has: [
          {
            type: 'header',
            key: 'x-skip-next-auth',
            value: '(?<skip>.*)',
          },
        ],
      },
      // Separate rule to handle non-auth API routes
      {
        source: '/api/:path((?!auth/).*)',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:5000/api/:path*' 
          : '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
