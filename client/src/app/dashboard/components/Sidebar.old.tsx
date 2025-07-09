'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  CreditCardIcon, 
  ChartBarIcon, 
  CogIcon,
  PlusCircleIcon
} from './Icons';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCardIcon },
  { name: 'Budgets', href: '/dashboard/budgets', icon: ChartBarIcon },
  { name: 'Add Transaction', href: '/dashboard/transactions/new', icon: PlusCircleIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ isMobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log('Sidebar isMobileOpen:', isMobileOpen);
  }, [isMobileOpen]);

  // This prevents hydration errors with responsive elements
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobileOpen && onCloseMobile) {
      onCloseMobile();
    }
  }, [pathname, isMobileOpen, onCloseMobile]);

  // Base sidebar content
  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-900">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-accent-500 flex items-center justify-center">
            <span className="text-white font-bold">GN</span>
          </div>
          <h1 className="text-xl font-bold text-white">Finance Dashboard</h1>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto bg-primary-800">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-100 hover:bg-primary-700'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out`}
                onClick={isMobileOpen && onCloseMobile ? onCloseMobile : undefined}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-accent-400' : 'text-primary-400 group-hover:text-accent-400'
                  } mr-3 flex-shrink-0 h-5 w-5`}
                  aria-hidden={true}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 bg-primary-900 text-xs text-primary-300 text-center">
        <p>My Finance</p>
      </div>
    </div>
  );

  if (!isClient) {
    // Return a placeholder during server rendering
    return (
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-primary-800"></div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop sidebar - always visible on md+ screens */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile sidebar - overlay that appears when menu is open */}
      <div className={`md:hidden fixed inset-0 flex z-50 ${isMobileOpen ? 'pointer-events-auto' : 'pointer-events-none'} transition-all duration-300 ease-in-out`}>
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-neutral-900 transition-opacity duration-300 ease-in-out ${isMobileOpen ? 'opacity-75 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
          onClick={onCloseMobile}
          aria-hidden="true"
        />
        
        {/* Sidebar */}
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-primary-800 shadow-xl transform transition-all duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'}`}>
          <div className="absolute top-0 right-0 -mr-14 pt-4">
            <button
              type="button"
              className={`ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-primary-700 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500 transition-all duration-300 ${isMobileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              onClick={onCloseMobile}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
