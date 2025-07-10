import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Script from 'next/script';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { forceDynamicRendering } from '../force-dynamic-rendering';
import { Toaster } from '../components/Toaster';

// Optimize font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Ensure text remains visible during font loading
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true, // Reduce layout shift
});

// Font is defined above with optimization settings

export const metadata: Metadata = {
  title: 'Personal Finance Dashboard',
  description: 'Track your income, expenses, and savings goals with a clean, interactive interface',
  metadataBase: new URL('http://localhost:3001'),
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon/favicon-32x32.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/favicon/apple-touch-icon.png',
      },
      {
        rel: 'android-chrome',
        sizes: '192x192',
        url: '/favicon/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome',
        sizes: '512x512',
        url: '/favicon/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
  // Add performance optimization hints
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Force dynamic rendering to prevent LCP inflation in background tabs
  headers();
  
  // Use the forceDynamicRendering utility to detect background tabs
  // Removed unused variable: isDynamicRender
  typeof window !== 'undefined' && forceDynamicRendering();
  
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preload critical assets */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="http://localhost:5000" />
        <link rel="preconnect" href="http://localhost:5000" crossOrigin="anonymous" />
        
        {/* Preload critical CSS */}
        <link rel="preload" href="/globals.css" as="style" />
        
        {/* Preload critical images that might be part of LCP */}
        <link rel="preload" href="/images/logo.png" as="image" fetchPriority="high" />
        
        {/* Add priority hints for critical resources */}
        <meta name="priority" content="high" />
      </head>
      <body className={inter.className}>
        {/* Add priority boundary to ensure critical content loads first */}
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-lg font-medium">Loading dashboard...</div>}>
          <Providers>
            {/* Use priority attribute for LCP elements */}
            <div className="contents">{children}</div>
            <Toaster />
          </Providers>
        </Suspense>
        
        {/* Defer non-critical scripts */}
        <Script
          src="https://cdn.jsdelivr.net/npm/chart.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
