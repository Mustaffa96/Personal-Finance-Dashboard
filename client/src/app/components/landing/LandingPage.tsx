import React from 'react';
import Link from 'next/link';
import Hero from '@/app/components/landing/Hero';
import Features from '@/app/components/landing/Features';
import Testimonials from '@/app/components/landing/Testimonials';
import CTASection from '@/app/components/landing/CTASection';
import Footer from '@/app/components/landing/Footer';

interface LandingPageProps {
  isLoggedIn: boolean;
}

export default function LandingPage({ isLoggedIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">
              FinanceDash
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Hero isLoggedIn={isLoggedIn} />
        <Features />
        <Testimonials />
        <CTASection isLoggedIn={isLoggedIn} />
      </main>

      <Footer />
    </div>
  );
}
