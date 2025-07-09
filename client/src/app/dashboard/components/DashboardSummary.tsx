'use client';

// Add priority loading hint
// @ts-ignore
export const runtime = 'edge';

import { useQuery } from '@tanstack/react-query';
import { ApiTransactionRepository } from '../../../adapters/repositories/TransactionRepository';
import { TransactionType } from '../../../domain/entities/Transaction';
import { formatCurrency } from '../../../lib/utils/formatters';
import { FaArrowUp, FaArrowDown, FaMoneyBillWave, FaMinusCircle, FaBalanceScale, FaPiggyBank } from 'react-icons/fa';

interface DashboardSummaryProps {
  userId: string;
}

export default function DashboardSummary({ userId }: DashboardSummaryProps) {
  const transactionRepository = new ApiTransactionRepository();
  
  // Get all transactions for the user
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => transactionRepository.findByUserId(userId),
    enabled: !!userId,
  });

  // Calculate summary data
  const calculateSummary = () => {
    if (!transactions) return { income: 0, expenses: 0, balance: 0, savingsRate: 0 };
    
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;
    const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;
    
    return {
      income,
      expenses,
      balance,
      savingsRate
    };
  };

  const summary = calculateSummary();

  return (
    <div className="px-0">
      {isLoading ? (
        <div className="p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="px-2">
            <div className="animate-pulse h-40 bg-blueGray-100 rounded-lg"></div>
          </div>
          <div className="px-2">
            <div className="animate-pulse h-40 bg-blueGray-100 rounded-lg"></div>
          </div>
          <div className="px-2">
            <div className="animate-pulse h-40 bg-blueGray-100 rounded-lg"></div>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
          {/* Income Card */}
          <div className="px-2">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 className="text-blueGray-400 uppercase font-bold text-xs">Income</h5>
                    <span className="font-bold text-xl text-blueGray-700">
                      {formatCurrency(summary.income)}
                    </span>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-emerald-500">
                      <FaMoneyBillWave className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-blueGray-500 mt-4">
                  <span className="text-emerald-500 mr-2 flex items-center">
                    <FaArrowUp className="mr-1" /> 3.48%
                  </span>
                  <span className="whitespace-nowrap">Since last month</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Expenses Card */}
          <div className="px-2">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 className="text-blueGray-400 uppercase font-bold text-xs">Expenses</h5>
                    <span className="font-bold text-xl text-blueGray-700">
                      {formatCurrency(summary.expenses)}
                    </span>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-red-500">
                      <FaMinusCircle className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-blueGray-500 mt-4">
                  <span className="text-red-500 mr-2 flex items-center">
                    <FaArrowDown className="mr-1" /> 1.10%
                  </span>
                  <span className="whitespace-nowrap">Since last month</span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Balance Card */}
          <div className="px-2">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 className="text-blueGray-400 uppercase font-bold text-xs">Balance</h5>
                    <span className="font-bold text-xl text-blueGray-700">
                      {formatCurrency(summary.balance)}
                    </span>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className={`text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full ${summary.balance >= 0 ? 'bg-blue-500' : 'bg-orange-500'}`}>
                      <FaBalanceScale className="h-5 w-5" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-blueGray-500 mt-4">
                  <span className={`${summary.balance >= 0 ? 'text-blue-500' : 'text-orange-500'} mr-2 flex items-center`}>
                    {summary.balance >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />} 2.32%
                  </span>
                  <span className="whitespace-nowrap">Since last month</span>
                </p>
              </div>
            </div>
          </div>

          </div>
          
          {/* Savings Rate - Separate Section */}
          <div className="w-full lg:w-1/2 px-2 mb-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex-auto p-4">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                    <h5 className="text-blueGray-400 uppercase font-bold text-xs mb-1">Savings Rate</h5>
                    <div className="flex items-center">
                      <span className="font-bold text-2xl text-blueGray-700 mr-2">
                        {summary.savingsRate}%
                      </span>
                      <span className={`${summary.savingsRate >= 0 ? 'text-emerald-500' : 'text-red-500'} text-sm flex items-center`}>
                        {summary.savingsRate >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />} 1.5% since last month
                      </span>
                    </div>
                  </div>
                  <div className="relative w-auto pl-4 flex-initial">
                    <div className={`text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full ${summary.savingsRate >= 20 ? 'bg-emerald-500' : summary.savingsRate >= 10 ? 'bg-blue-500' : 'bg-orange-500'}`}>
                      <FaPiggyBank className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
