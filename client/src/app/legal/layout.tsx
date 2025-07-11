import React from 'react';
import Link from 'next/link';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Personal Finance Dashboard
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link href="/legal/privacy-policy" className="text-gray-600 hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link href="/legal/terms-of-service" className="text-gray-600 hover:text-blue-600">
                Terms of Service
              </Link>
              <Link href="/legal/cookie-policy" className="text-gray-600 hover:text-blue-600">
                Cookie Policy
              </Link>
              <Link href="/legal/gdpr" className="text-gray-600 hover:text-blue-600">
                GDPR
              </Link>
            </nav>
          </div>
        </div>
      </div>
      
      <main>{children}</main>
      
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Personal Finance Dashboard. All rights reserved.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link href="/legal/privacy-policy" className="hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link href="/legal/terms-of-service" className="hover:text-blue-600">
                Terms of Service
              </Link>
              <Link href="/legal/cookie-policy" className="hover:text-blue-600">
                Cookie Policy
              </Link>
              <Link href="/legal/gdpr" className="hover:text-blue-600">
                GDPR
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
