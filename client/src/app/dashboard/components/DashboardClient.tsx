'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Use dynamic imports with loading priority for critical components
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: true });
const Header = dynamic(() => import('./Header'), { ssr: true });

interface DashboardClientProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  children: React.ReactNode;
}

export default function DashboardClient({ user, children }: DashboardClientProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    console.log('Toggle sidebar:', !isMobileSidebarOpen);
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  // Close sidebar when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onCloseMobile={closeMobileSidebar} 
      />
      <div className="relative md:ml-64 bg-blueGray-50">
        <Header 
          user={user} 
          onMobileMenuToggle={toggleMobileSidebar} 
        />
        {/* Header gradient - Optimized for LCP */}
        <div className="relative bg-blue-600 md:pt-24 pb-24 pt-10">
          <div className="px-4 md:px-10 mx-auto w-full">
            <div className="flex flex-wrap items-center">
              <div className="w-full lg:w-6/12 xl:w-8/12 px-4">
                <h2 className="text-white text-2xl font-bold mb-2">Welcome back, {user.name || 'User'}</h2>
                {/* This is the LCP element - optimized with better contrast and rendering priority */}
                <p className="text-white font-medium">Track, manage, and optimize your personal finances with our dashboard</p>
              </div>
              <div className="w-full lg:w-6/12 xl:w-4/12 px-4 text-right">
                <Link
                  href="/dashboard/transactions/new"
                  className="bg-white text-blue-600 active:bg-blue-100 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Transaction
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 md:px-10 mx-auto w-full -m-16 pt-4 pb-16 min-h-screen">
          <div className="flex flex-wrap">
            <div className="w-full">
              <main className="flex-1 overflow-y-auto bg-transparent">
                {children}
              </main>
            </div>
          </div>
          <footer className="block py-4 mt-8">
            <div className="container mx-auto px-4">
              <hr className="mb-4 border-b-1 border-blueGray-200" />
              <div className="flex flex-wrap items-center md:justify-between justify-center">
                <div className="w-full md:w-4/12 px-4">
                  <div className="text-sm text-blueGray-500 font-semibold py-1 text-center md:text-left">
                    © {new Date().getFullYear()}{" "}
                    <a 
                      href="https://github.com/Mustaffa96" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blueGray-500 hover:text-blueGray-700 text-sm font-semibold py-1 cursor-pointer transition-colors"
                    >
                      Personal Finance Dashboard
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
