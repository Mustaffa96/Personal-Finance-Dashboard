import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth-options';
import Link from 'next/link';
// import DashboardSummary from './components/DashboardSummary';
import RecentTransactions from './components/RecentTransactions';
import BudgetOverview from './components/BudgetOverview';
import ExpenseCategoryChart from './components/ExpenseCategoryChart';
import MonthlyTrendsChart from './components/MonthlyTrendsChart';

export const metadata: Metadata = {
  title: 'Dashboard | Personal Finance Dashboard',
  description: 'View your financial overview',
};

// Define the session type to include user with id
type UserSession = {
  user: {
    id: string;
    name?: string;
    email?: string;
  };
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions) as UserSession | null;
  
  // If session doesn't exist, the layout will redirect to login
  // This ensures userId is always defined when this component renders
  const userId = session?.user.id || '';

  return (
    <div className="container mx-auto" style={{contain: 'content', contentVisibility: 'auto', minHeight: '100vh'}}>
      <div className="flex flex-wrap -mx-4"> {/* Negative margin to offset card padding */}
        {/* First row - 2 cards */}
        <div className="w-full lg:w-1/2 p-4" style={{contain: 'content'}}>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded h-full" style={{minHeight: '450px'}}>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full max-w-full flex-grow flex-1">
                  <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">Overview</h6>
                  <h2 className="text-blueGray-700 text-xl font-semibold">Expense Categories</h2>
                </div>
              </div>
            </div>
            <div className="p-4 flex-auto">
              <div className="relative w-full h-[350px]" style={{contain: 'style'}}>
                <ExpenseCategoryChart userId={userId} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 p-4" style={{contain: 'content'}}>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded h-full" style={{minHeight: '450px'}}>
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full max-w-full flex-grow flex-1">
                  <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">Performance</h6>
                  <h2 className="text-blueGray-700 text-xl font-semibold">Monthly Trends</h2>
                </div>
              </div>
            </div>
            <div className="p-4 pb-8 flex-auto">
              <div className="relative w-full h-[350px]" style={{contain: 'style'}}>
                <MonthlyTrendsChart userId={userId} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Second row - 2 cards */}
        <div className="w-full lg:w-1/2 p-4" style={{contain: 'content'}}>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded h-full" style={{minHeight: '400px'}}>
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full pr-4 max-w-full flex-grow flex-1" style={{minHeight: '48px', contain: 'size layout'}}>
                  <h3 className="font-semibold text-base text-blueGray-700">Recent Transactions</h3>
                </div>
                <div className="relative w-auto flex-initial text-right">
                  <Link
                    href="/dashboard/transactions"
                    className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >
                    See all
                  </Link>
                </div>
              </div>
            </div>
            <div className="block w-full overflow-x-auto p-4" style={{minHeight: '250px'}}>
              <RecentTransactions userId={userId} />
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 p-4" style={{contain: 'content'}}>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded h-full" style={{minHeight: '400px'}}>
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full pr-4 max-w-full flex-grow flex-1" style={{minHeight: '48px', contain: 'size layout'}}>
                  <h3 className="font-semibold text-base text-blueGray-700">Budget Overview</h3>
                </div>
                <div className="relative w-auto flex-initial text-right">
                  <Link
                    href="/dashboard/budgets"
                    className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  >
                    See all
                  </Link>
                </div>
              </div>
            </div>
            <div className="block w-full overflow-x-auto p-4" style={{minHeight: '250px'}}>
              <BudgetOverview userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
