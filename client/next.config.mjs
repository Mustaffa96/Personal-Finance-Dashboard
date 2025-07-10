/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize page loading speed
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // Improve LCP by enabling compression
  compress: true,
  // Optimize bundle size with production mode
  productionBrowserSourceMaps: false,
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // Optimize imports for better performance
    optimizePackageImports: ["@tanstack/react-query", "@radix-ui/react-icons", "lucide-react"],
    // Improve page loading performance
    optimizeCss: true,
    // Optimize LCP by prioritizing critical CSS
    optimisticClientCache: true,
    // Optimize bundle size
    optimizeServerReact: true,
    // Improve LCP with server components
    serverComponentsExternalPackages: [],
    // Enable streaming for faster initial load
    serverActions: { bodySizeLimit: '2mb' },
  },
  // Enable image optimization
  images: {
    // Improve LCP by optimizing image loading
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimize image loading for better LCP
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
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
