'use client';

import { useState, useEffect } from 'react';

interface PortfolioDisclaimerProps {
  onClose: () => void;
}

export default function PortfolioDisclaimer({ onClose }: PortfolioDisclaimerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after a slight delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    
    // Add a slight delay before calling onClose to allow animation to complete
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 opacity-100"
        style={{ 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Portfolio Project Notice</h3>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This Personal Finance Dashboard is a portfolio project and uses free-tier server resources.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Please note that data loading may be slower than a production application due to the hosting plan being used.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Thank you for your understanding and for taking the time to explore this project!
          </p>
        </div>
        
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
}
