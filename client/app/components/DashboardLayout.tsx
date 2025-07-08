'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { 
  HomeIcon, 
  CreditCardIcon, 
  ChartPieIcon, 
  DocumentTextIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: HomeIcon },
    { name: 'Transactions', href: '/dashboard/transactions', icon: CreditCardIcon },
    { name: 'Budgets', href: '/dashboard/budgets', icon: ChartPieIcon },
    { name: 'Reports', href: '/dashboard/reports', icon: DocumentTextIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
  ];
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname?.startsWith(path);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-primary-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-white font-bold text-xl">Finance Dashboard</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-primary-900 text-white'
                        : 'text-primary-100 hover:bg-primary-700'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className="mr-3 flex-shrink-0 h-6 w-6"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-primary-700 p-4">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <div>
                    <ArrowLeftOnRectangleIcon className="h-6 w-6 text-primary-100" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-primary-100 group-hover:text-white">
                      Sign Out
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                isActive(item.href)
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-primary-500'
              } flex flex-col items-center py-2 px-1`}
            >
              <item.icon
                className="h-6 w-6"
                aria-hidden="true"
              />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
