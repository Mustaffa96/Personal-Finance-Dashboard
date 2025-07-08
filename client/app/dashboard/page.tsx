'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import OverviewCard from '@/components/dashboard/OverviewCard';
import TransactionList from '@/components/dashboard/TransactionList';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import BudgetProgress from '@/components/dashboard/BudgetProgress';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 bg-gradient-to-r from-primary-50 to-white p-4 sm:p-6 rounded-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-gray-600 mt-1">Here's an overview of your finances</p>
      </div>

      {/* Dashboard Tabs */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
            icon="📊"
          >
            Overview
          </TabButton>
          <TabButton 
            active={activeTab === 'transactions'} 
            onClick={() => setActiveTab('transactions')}
            icon="💸"
          >
            Transactions
          </TabButton>
          <TabButton 
            active={activeTab === 'budgets'} 
            onClick={() => setActiveTab('budgets')}
            icon="💰"
          >
            Budgets
          </TabButton>
          <TabButton 
            active={activeTab === 'reports'} 
            onClick={() => setActiveTab('reports')}
            icon="📈"
          >
            Reports
          </TabButton>
        </nav>
      </div>

      {/* Dashboard Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <OverviewCard 
              title="Total Balance" 
              amount="$5,240.00" 
              trend="+2.5%" 
              trendDirection="up" 
              icon="💰"
            />
            <OverviewCard 
              title="Monthly Income" 
              amount="$3,500.00" 
              trend="+0%" 
              trendDirection="neutral" 
              icon="💸"
            />
            <OverviewCard 
              title="Monthly Expenses" 
              amount="$2,260.00" 
              trend="-4.3%" 
              trendDirection="down" 
              icon="📉"
            />
            <OverviewCard 
              title="Savings Rate" 
              amount="35.4%" 
              trend="+2.1%" 
              trendDirection="up" 
              icon="📈"
            />
          </div>

          {/* Charts and Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2 text-primary-500">📊</span> Expense Breakdown
              </h2>
              <ExpenseChart />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all hover:shadow-md">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2 text-primary-500">🎯</span> Budget Progress
              </h2>
              <BudgetProgress />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <span className="mr-2 text-primary-500">📝</span> Recent Transactions
              </h2>
              <button 
                onClick={() => setActiveTab('transactions')}
                className="text-sm bg-primary-50 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-100 transition-colors"
              >
                View All
              </button>
            </div>
            <TransactionList limit={5} />
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="mr-2 text-primary-500">💸</span> All Transactions
            </h2>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Transaction
            </button>
          </div>
          <TransactionList />
        </div>
      )}

      {activeTab === 'budgets' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold flex items-center">
              <span className="mr-2 text-primary-500">💰</span> Budget Categories
            </h2>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Budget
            </button>
          </div>
          <BudgetProgress showAll />
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 transition-all hover:shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2 text-primary-500">📈</span> Financial Reports
          </h2>
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-600 mb-4">
              Detailed financial reports and analytics will be available here.
            </p>
            <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors">
              Generate Report
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function TabButton({ 
  children, 
  active, 
  onClick,
  icon
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
  icon?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap pb-4 px-2 border-b-2 font-medium text-sm flex items-center transition-colors ${
        active
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
