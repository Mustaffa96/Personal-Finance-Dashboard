'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic imports with optimized loading strategy
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const Header = dynamic(() => import('./Header'), { ssr: false });
const DashboardSummary = dynamic(() => import('./DashboardSummary'), { 
  ssr: false,
  loading: () => (
    <div className="w-full animate-pulse">
      <div className="flex flex-wrap w-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full lg:w-6/12 xl:w-3/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg h-[140px]">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
});

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
              <div className="w-full px-4">
                <h2 className="text-white text-2xl font-bold mb-2">Welcome back, {user.name || 'User'}</h2>
              </div>
            </div>
            {/* Dashboard summary cards */}
            <div className="flex flex-wrap">
              <DashboardSummary userId={user.id} />
            </div>
          </div>
        </div>
        <div className="px-4 md:px-10 mx-auto w-full pt-24 pb-16 min-h-screen relative z-10 bg-gray-100">
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
