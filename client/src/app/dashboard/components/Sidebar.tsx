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

  // This prevents hydration errors with responsive elements
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Base sidebar content
  const sidebarContent = (
    <div className="relative h-full">
      {/* Sidebar header */}
      <div className="md:min-h-full">
        {/* Brand */}
        <div className="md:pt-32 pb-8 pt-12">
          <div className="w-full px-4 mx-auto flex justify-center">
            <div className="h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center">
              <span className="text-slate-800 text-2xl font-bold">PF</span>
            </div>
          </div>
          <div className="text-center mt-4">
            <h6 className="text-xl font-bold text-white">Finance Dashboard</h6>
          </div>
        </div>
        
        {/* Divider */}
        <hr className="my-4 md:min-w-full border-t border-slate-500 opacity-25" />
        
        {/* Navigation */}
        <div className="md:min-w-full px-4">
          <h6 className="md:min-w-full text-xs uppercase font-bold block pt-1 pb-4 no-underline text-slate-300">
            Main Navigation
          </h6>
          <nav className="md:flex-col md:min-w-full flex flex-col list-none space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-slate-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-600/70'
                  } text-xs uppercase py-3 font-bold block rounded-lg transition-all duration-150 ease-in-out px-4`}
                  onClick={onCloseMobile}
                >
                  <div className="flex items-center">
                    <div className={`mr-2 text-sm ${isActive ? 'opacity-100' : 'opacity-75'}`}>
                      <item.icon
                        className="h-4 w-4"
                        aria-hidden={true}
                      />
                    </div>
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Divider */}
        <hr className="my-4 md:min-w-full border-t border-slate-500 opacity-25" />
        
        {/* Heading */}
        <h6 className="md:min-w-full text-xs uppercase font-bold block pt-1 pb-4 no-underline text-slate-300 px-4">
          Account Pages
        </h6>
        
        {/* Navigation */}
        <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4 space-y-1 px-4">
          <li>
            <Link
              href="/dashboard/profile"
              className="text-slate-300 hover:text-white hover:bg-slate-600/70 text-xs uppercase py-3 font-bold block rounded-lg transition-all duration-150 ease-in-out px-4"
            >
              <div className="flex items-center">
                <div className="mr-2 text-sm opacity-75">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Profile
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );

  if (!isClient) {
    // Return a placeholder during server rendering
    return (
      <div className="hidden md:block md:fixed md:top-0 md:bottom-0 md:left-0 md:z-50 md:overflow-hidden">
        <div className="md:flex md:flex-col md:w-64 bg-slate-800"></div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop sidebar - always visible on md+ screens */}
      <div className="hidden md:block md:fixed md:top-0 md:bottom-0 md:left-0 md:z-50 md:overflow-hidden">
        <div className="md:flex md:flex-col md:w-64 bg-slate-800 shadow-xl h-full">
          {sidebarContent}
        </div>
      </div>

      {/* Mobile sidebar - overlay that appears when menu is open */}
      <div className={`md:hidden fixed inset-0 flex z-50 ${isMobileOpen ? 'pointer-events-auto' : 'pointer-events-none'} transition-all duration-300 ease-in-out`}>
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-blueGray-900 transition-opacity duration-300 ease-in-out ${isMobileOpen ? 'opacity-75 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
          onClick={onCloseMobile}
          aria-hidden="true"
        />
        
        {/* Sidebar */}
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-slate-800 shadow-xl transform transition-all duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full pointer-events-none'}`}>
          <div className="absolute top-0 right-0 -mr-14 pt-4">
            <button
              type="button"
              className={`ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-400 transition-all duration-300 ${isMobileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
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
