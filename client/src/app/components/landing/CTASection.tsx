import React from 'react';
import Link from 'next/link';

interface CTASectionProps {
  isLoggedIn: boolean;
}

export default function CTASection({ isLoggedIn }: CTASectionProps) {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-8 py-16 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who have improved their financial health with our easy-to-use dashboard. Start your journey to financial freedom today.
            </p>
            
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                className="inline-block px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/register" 
                  className="inline-block px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Get Started for Free
                </Link>
                <Link 
                  href="/login" 
                  className="inline-block px-8 py-4 border border-white text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your financial needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic</h3>
                <p className="text-gray-600 mb-6">Perfect for getting started</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Expense tracking</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Basic budgeting</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Monthly reports</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Email support</span>
                  </li>
                </ul>
                <Link 
                  href="/register" 
                  className="block w-full py-3 text-center bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white border-2 border-blue-500 rounded-xl overflow-hidden shadow-lg relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-medium">
                Popular
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
                <p className="text-gray-600 mb-6">For serious financial planning</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$9.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Everything in Basic</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Financial goals</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Priority support</span>
                  </li>
                </ul>
                <Link 
                  href="/register" 
                  className="block w-full py-3 text-center bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Pro
                </Link>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-6">For businesses and teams</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$29.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Team collaboration</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">API access</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">Dedicated support</span>
                  </li>
                </ul>
                <Link 
                  href="/register" 
                  className="block w-full py-3 text-center bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
