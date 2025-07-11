import React from 'react';
import Link from 'next/link';

interface HeroProps {
  isLoggedIn: boolean;
}

export default function Hero({ isLoggedIn }: HeroProps) {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10" />
      
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Hero content */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Take Control of Your <span className="text-blue-600">Financial Future</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              Track expenses, manage budgets, and gain insights into your spending habits with our intuitive personal finance dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isLoggedIn ? (
                <Link 
                  href="/dashboard" 
                  className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    href="/register" 
                    className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    Get Started — It&apos;s Free
                  </Link>
                  <Link 
                    href="/login" 
                    className="px-8 py-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Hero image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
              <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
              
              <div className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                  <div className="bg-gray-50 p-4 rounded-xl mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Monthly Overview</h3>
                    <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium">Dashboard Chart</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-sm text-gray-500">Total Savings</p>
                      <p className="text-xl font-bold text-gray-800">$2,540</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-sm text-gray-500">Monthly Budget</p>
                      <p className="text-xl font-bold text-gray-800">$4,000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
