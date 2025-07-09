import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';
import DashboardSummary from './components/DashboardSummary';
import RecentTransactions from './components/RecentTransactions';
import BudgetOverview from './components/BudgetOverview';
import ExpenseCategoryChart from './components/ExpenseCategoryChart';
import MonthlyTrendsChart from './components/MonthlyTrendsChart';

export const metadata: Metadata = {
  title: 'Dashboard | Personal Finance Dashboard',
  description: 'View your financial overview',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // If session doesn't exist, the layout will redirect to login
  // This ensures userId is always defined when this component renders
  const userId = session?.user.id || '';

  return (
    <div className="flex flex-wrap">
      {/* Main content area */}
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-lg text-blueGray-700">Financial Overview</h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <Link
                  href="/dashboard/transactions"
                  className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  See all transactions
                </Link>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto p-4">
            {/* Dashboard summary */}
            <DashboardSummary userId={userId} />
          </div>
        </div>
        
        {/* Charts */}
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
              <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full max-w-full flex-grow flex-1">
                    <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">Overview</h6>
                    <h2 className="text-blueGray-700 text-xl font-semibold">Expense Categories</h2>
                  </div>
                </div>
              </div>
              <div className="p-4 flex-auto">
                <div className="relative h-350-px">
                  <ExpenseCategoryChart userId={userId} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
              <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full max-w-full flex-grow flex-1">
                    <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">Performance</h6>
                    <h2 className="text-blueGray-700 text-xl font-semibold">Monthly Trends</h2>
                  </div>
                </div>
              </div>
              <div className="p-4 pb-8 flex-auto">
                <div className="relative h-350-px">
                  <MonthlyTrendsChart userId={userId} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar content */}
      <div className="w-full xl:w-4/12 px-4">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-blueGray-700">Recent Transactions</h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <Link
                  href="/dashboard/transactions"
                  className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  See all
                </Link>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            <RecentTransactions userId={userId} />
          </div>
        </div>
        
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-blueGray-700">Budget Overview</h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <Link
                  href="/dashboard/budgets"
                  className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                >
                  See all
                </Link>
              </div>
            </div>
          </div>
          <div className="block w-full overflow-x-auto">
            <BudgetOverview userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
