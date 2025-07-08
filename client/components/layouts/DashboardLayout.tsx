'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#profile-menu-button') && !target.closest('#profile-dropdown')) {
        setProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Transactions', href: '/dashboard/transactions', icon: '💸' },
    { name: 'Budgets', href: '/dashboard/budgets', icon: '💰' },
    { name: 'Goals', href: '/dashboard/goals', icon: '🎯' },
    { name: 'Reports', href: '/dashboard/reports', icon: '📈' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:z-0`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-primary-50">
          <h1 className="text-xl font-bold text-primary-700">Finance Dashboard</h1>
          <button 
            className="md:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>
        
        {/* Sidebar navigation */}
        <div className="flex flex-col justify-between h-[calc(100%-4rem)]">
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                    ? 'bg-primary-100 text-primary-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3 text-xl flex-shrink-0">{item.icon}</span>
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-5 rounded-full bg-primary-500"></span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Sidebar footer */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <span className="mr-3 text-xl">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 md:hidden">
          <button
            type="button"
            className="p-2 text-gray-500 rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-primary-700">Finance Dashboard</h1>
          {/* Profile button for mobile */}
          <button
            id="profile-menu-button"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt="Profile" 
                width={32} 
                height={32} 
                className="rounded-full"
              />
            ) : (
              <span className="text-sm font-medium">
                {session?.user?.name?.charAt(0) || 'U'}
              </span>
            )}
          </button>
        </div>
        
        {/* Desktop header with profile menu */}
        <div className="hidden md:flex justify-end items-center h-16 px-6 bg-white border-b border-gray-200">
          <div className="relative">
            <button
              id="profile-menu-button"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">
                  {session?.user?.name || 'User'}
                </span>
                <span className="text-xs text-gray-500">
                  {session?.user?.email || ''}
                </span>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-700">
                {session?.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt="Profile" 
                    width={40} 
                    height={40} 
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-lg font-medium">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
            </button>
            
            {/* Profile dropdown menu */}
            {profileMenuOpen && (
              <div 
                id="profile-dropdown"
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              >
                <Link 
                  href="/dashboard/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <span className="mr-2">👤</span>
                    Your Profile
                  </div>
                </Link>
                <Link 
                  href="/dashboard/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <span className="mr-2">⚙️</span>
                    Settings
                  </div>
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="mr-2">🚪</span>
                    Sign out
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile profile dropdown */}
        {profileMenuOpen && (
          <div 
            id="profile-dropdown"
            className="absolute right-4 top-16 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 md:hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{session?.user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email || ''}</p>
            </div>
            <Link 
              href="/dashboard/profile" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setProfileMenuOpen(false)}
            >
              <div className="flex items-center">
                <span className="mr-2">👤</span>
                Your Profile
              </div>
            </Link>
            <Link 
              href="/dashboard/settings" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setProfileMenuOpen(false)}
            >
              <div className="flex items-center">
                <span className="mr-2">⚙️</span>
                Settings
              </div>
            </Link>
          </div>
        )}
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
