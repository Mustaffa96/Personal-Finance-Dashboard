'use client';

// Remove edge runtime as it can cause issues with data fetching
// Focus on client-side performance instead

import { useQuery } from '@tanstack/react-query';
import { ApiTransactionRepository } from '../../../adapters/repositories/TransactionRepository';
import { TransactionType } from '../../../domain/entities/Transaction';
import { formatCurrency } from '../../../lib/utils/formatters';
import { FaArrowUp, FaArrowDown, FaChartLine, FaUsers, FaShoppingCart, FaPercent } from 'react-icons/fa';

// Create lightweight icon components
const Icons = {
  ArrowUp: () => <FaArrowUp className="mr-1 h-3 w-3" />,
  ArrowDown: () => <FaArrowDown className="mr-1 h-3 w-3" />,
  ChartLine: () => <FaChartLine className="h-5 w-5" />,
  Users: () => <FaUsers className="h-5 w-5" />,
  ShoppingCart: () => <FaShoppingCart className="h-5 w-5" />,
  Percent: () => <FaPercent className="h-5 w-5" />
};

interface DashboardSummaryProps {
  userId: string;
}

export default function DashboardSummary({ userId }: DashboardSummaryProps) {
  const transactionRepository = new ApiTransactionRepository();
  
  // Get all transactions for the user with optimized query settings
  const { data: transactions = [], isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => transactionRepository.findByUserId(userId),
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
    retry: 2,
    refetchOnMount: true
  });
  
  // Log any errors for debugging
  if (isError) {
    console.error('Error fetching transactions:', error);
  }

  // Calculate summary data with safeguards against invalid data
  const calculateSummary = () => {
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      console.log('No transactions available or invalid data format');
      return { income: 0, expenses: 0, balance: 0, savingsRate: 0 };
    }
    
    try {
      const income = transactions
        .filter((t) => t && t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      
      const expenses = transactions
        .filter((t) => t && t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      
      const balance = income - expenses;
      const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;
      
      console.log('Calculated summary:', { income, expenses, balance, savingsRate });
      
      return {
        income,
        expenses,
        balance,
        savingsRate
      };
    } catch (err) {
      console.error('Error calculating summary:', err);
      return { income: 0, expenses: 0, balance: 0, savingsRate: 0 };
    }
  };

  const summary = calculateSummary();
  
  // Prepare static placeholder with exact dimensions to prevent layout shift
  // This ensures the placeholder has the same size and structure as the loaded content
  const renderPlaceholder = () => (
    <div className="flex flex-wrap w-full">
      {/* Income Card Placeholder */}
      <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg h-[140px]">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <div className="animate-pulse h-4 w-16 bg-blueGray-200 rounded mb-2"></div>
                <div className="animate-pulse h-6 w-24 bg-blueGray-200 rounded"></div>
              </div>
              <div className="relative w-auto pl-4 flex-initial">
                <div className="animate-pulse bg-gradient-to-tr from-orange-500 to-orange-700 p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full"></div>
              </div>
            </div>
            <div className="animate-pulse h-4 w-32 bg-blueGray-200 rounded mt-4"></div>
          </div>
        </div>
      </div>
      
      {/* Expenses Card Placeholder */}
      <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg h-[140px]">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <div className="animate-pulse h-4 w-16 bg-blueGray-200 rounded mb-2"></div>
                <div className="animate-pulse h-6 w-24 bg-blueGray-200 rounded"></div>
              </div>
              <div className="relative w-auto pl-4 flex-initial">
                <div className="animate-pulse bg-gradient-to-tr from-pink-500 to-pink-700 p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full"></div>
              </div>
            </div>
            <div className="animate-pulse h-4 w-32 bg-blueGray-200 rounded mt-4"></div>
          </div>
        </div>
      </div>
      
      {/* Balance Card Placeholder */}
      <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg h-[140px]">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <div className="animate-pulse h-4 w-16 bg-blueGray-200 rounded mb-2"></div>
                <div className="animate-pulse h-6 w-24 bg-blueGray-200 rounded"></div>
              </div>
              <div className="relative w-auto pl-4 flex-initial">
                <div className="animate-pulse bg-gradient-to-tr from-blue-500 to-blue-700 p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full"></div>
              </div>
            </div>
            <div className="animate-pulse h-4 w-32 bg-blueGray-200 rounded mt-4"></div>
          </div>
        </div>
      </div>
      
      {/* Savings Rate Card Placeholder */}
      <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg h-[140px]">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <div className="animate-pulse h-4 w-16 bg-blueGray-200 rounded mb-2"></div>
                <div className="animate-pulse h-6 w-24 bg-blueGray-200 rounded"></div>
              </div>
              <div className="relative w-auto pl-4 flex-initial">
                <div className="animate-pulse bg-gradient-to-tr from-emerald-500 to-emerald-700 p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full"></div>
              </div>
            </div>
            <div className="animate-pulse h-4 w-32 bg-blueGray-200 rounded mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use a consistent wrapper for both loading and loaded states to prevent layout shift
  // For debugging - log the current state
  console.log('DashboardSummary render state:', { 
    isLoading, 
    isFetching, 
    transactionsLength: transactions?.length || 0,
    userId
  });

  return (
    <div className="flex flex-wrap w-full">
      {(isLoading || isFetching) ? renderPlaceholder() : (
        <>
          {/* Income Card */}
          <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg h-[140px]">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 className="text-blueGray-400 uppercase font-bold text-xs">Total Income</h5>
                    <span className="font-bold text-xl text-blueGray-700" data-testid="income-value">
                      {formatCurrency(summary.income)}
                    </span>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-gradient-to-tr from-orange-500 to-orange-700">
                      <Icons.ChartLine />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-blueGray-500 mt-4">
                  <span className="text-emerald-500 mr-2 flex items-center">
                    <Icons.ArrowUp /> 3.48%
                  </span>
                  <span className="whitespace-nowrap">Since last month</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Expenses Card */}
          <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg h-[140px]">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 className="text-blueGray-400 uppercase font-bold text-xs">Total Expenses</h5>
                    <span className="font-bold text-xl text-blueGray-700">
                      {formatCurrency(summary.expenses)}
                    </span>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-gradient-to-tr from-pink-500 to-pink-700">
                      <Icons.ShoppingCart />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-blueGray-500 mt-4">
                  <span className="text-red-500 mr-2 flex items-center">
                    <Icons.ArrowDown /> 1.10%
                  </span>
                  <span className="whitespace-nowrap">Since last month</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Balance Card */}
          <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg h-[140px]">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 className="text-blueGray-400 uppercase font-bold text-xs">Net Balance</h5>
                    <span className="font-bold text-xl text-blueGray-700">
                      {formatCurrency(summary.balance)}
                    </span>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-gradient-to-tr from-blue-500 to-blue-700">
                      <Icons.Users />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-blueGray-500 mt-4">
                  <span className={`${summary.balance >= 0 ? 'text-blue-500' : 'text-orange-500'} mr-2 flex items-center`}>
                    {summary.balance >= 0 ? <Icons.ArrowUp /> : <Icons.ArrowDown />} 2.32%
                  </span>
                  <span className="whitespace-nowrap">Since last month</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Savings Rate Card */}
          <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-6 xl:mb-0 shadow-lg h-[140px]">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 className="text-blueGray-400 uppercase font-bold text-xs">Savings Rate</h5>
                    <span className="font-bold text-2xl text-blueGray-700 mr-2">
                      {summary.savingsRate}%
                    </span>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700">
                      <Icons.Percent />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-blueGray-500 mt-4">
                  <span className={`${summary.savingsRate >= 0 ? 'text-emerald-500' : 'text-red-500'} mr-2 flex items-center`}>
                    {summary.savingsRate >= 0 ? <Icons.ArrowUp /> : <Icons.ArrowDown />} 1.5%
                  </span>
                  <span className="whitespace-nowrap">Since last month</span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
