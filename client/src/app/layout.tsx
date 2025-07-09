import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

// Optimize font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Ensure text remains visible during font loading
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

// Font is defined above with optimization settings

export const metadata: Metadata = {
  title: 'Personal Finance Dashboard',
  description: 'Track your income, expenses, and savings goals with a clean, interactive interface',
  metadataBase: new URL('http://localhost:3001'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preload critical assets */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="http://localhost:5000" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
