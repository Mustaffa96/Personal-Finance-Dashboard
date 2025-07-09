/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ["@tanstack/react-query"],
    // Improve page loading performance
    optimizeCss: true,
    // Optimize fonts
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
  // Enable image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/categories/:path*',
        destination: 'http://localhost:5000/api/categories/:path*'
      },
      {
        source: '/transactions/:path*',
        destination: 'http://localhost:5000/api/transactions/:path*'
      },
      {
        source: '/users/:path*',
        destination: 'http://localhost:5000/api/users/:path*'
      },
      {
        source: '/budgets/:path*',
        destination: 'http://localhost:5000/api/budgets/:path*'
      }
    ];
  }
};

export default nextConfig;
