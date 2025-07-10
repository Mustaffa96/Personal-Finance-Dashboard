'use client';

// Add priority loading hint
export const runtime = 'edge';
export const preferredRegion = 'auto';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ApiTransactionRepository } from '../../../adapters/repositories/TransactionRepository';
import { ApiCategoryRepository } from '../../../adapters/repositories/CategoryRepository';
import { TransactionType } from '../../../domain/entities/Transaction';
import { formatCurrency, formatDate } from '../../../lib/utils/formatters';
import { useEffect, useState, memo, useMemo } from 'react';

// Memoize SVG components to avoid re-renders
const IncomeIcon = memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
  </svg>
));
IncomeIcon.displayName = 'IncomeIcon';

const ExpenseIcon = memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
  </svg>
));
ExpenseIcon.displayName = 'ExpenseIcon';

const AddIcon = memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
));
AddIcon.displayName = 'AddIcon';

interface RecentTransactionsProps {
  userId: string;
}

// Create a loading placeholder component that exactly matches the table structure
const TransactionTableSkeleton = memo(() => (
  <div className="block w-full overflow-x-auto" style={{height: '250px', contain: 'size layout'}}>
    <table className="items-center w-full bg-transparent border-collapse">
      <thead>
        <tr>
          <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
            <div className="h-4 bg-blueGray-200 rounded w-20 animate-pulse"></div>
          </th>
          <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
            <div className="h-4 bg-blueGray-200 rounded w-16 animate-pulse"></div>
          </th>
          <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
            <div className="h-4 bg-blueGray-200 rounded w-16 animate-pulse"></div>
          </th>
          <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right bg-blueGray-50 text-blueGray-500 border-blueGray-100">
            <div className="h-4 bg-blueGray-200 rounded w-16 ml-auto animate-pulse"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        {[...Array(5)].map((_, i) => (
          <tr key={i} className="border-b border-blueGray-200">
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blueGray-200 mr-3 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-blueGray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                </div>
              </div>
            </td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <div className="h-4 bg-blueGray-200 rounded w-16 animate-pulse"></div>
            </td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <div className="h-6 bg-blueGray-200 rounded w-20 animate-pulse"></div>
            </td>
            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
              <div className="h-4 bg-blueGray-200 rounded w-16 ml-auto animate-pulse"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));
TransactionTableSkeleton.displayName = 'TransactionTableSkeleton';

export default function RecentTransactions({ userId }: RecentTransactionsProps) {
  const transactionRepository = new ApiTransactionRepository();
  const categoryRepository = new ApiCategoryRepository();
  
  // State for tracking if component is mounted (for deferred loading)
  const [isMounted, setIsMounted] = useState(false);
  
  // Use effect to defer non-critical data loading
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Get all transactions for the user with deferred loading
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => transactionRepository.findByUserId(userId),
    enabled: !!userId && isMounted,
    // Use a short stale time to ensure fresh data but allow caching
    staleTime: 30 * 1000, // 30 seconds
  });

  // Get all categories with deferred loading
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryRepository.findAll(),
    enabled: isMounted,
    // Categories change less frequently, so we can cache them longer
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Function to get category name by ID
  const getCategoryName = (categoryId?: string): string => {
    // Handle undefined categoryId
    if (!categoryId) {
      return 'Uncategorized';
    }

    if (!categories || categories.length === 0) {
      console.log('Categories not loaded yet or empty array', { categoryId });
      return 'Loading...';
    }
    
    // Try to find by id first
    let category = categories.find(cat => cat.id === categoryId);
    
    // If not found by id, try to find by _id (MongoDB ID format)
    if (!category) {
      category = categories.find(cat => cat._id === categoryId);
    }
    
    if (!category) {
      console.log('Category not found for ID:', categoryId, 
                'Available categories:', categories.map(c => ({ id: c.id, _id: c._id, name: c.name })));
      return 'Unknown';
    }
    
    return category.name;
  };

  // Get the 5 most recent transactions - memoized to avoid dependency changes in useEffect
  const recentTransactions = useMemo(() => {
    return transactions
      ? [...transactions]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
      : [];
  }, [transactions]);

  // Render optimized table header separately to avoid re-renders
  const TableHeader = memo(() => (
    <thead>
      <tr>
        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
          Transaction
        </th>
        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
          Date
        </th>
        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
          Category
        </th>
        <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-right bg-blueGray-50 text-blueGray-500 border-blueGray-100">
          Amount
        </th>
      </tr>
    </thead>
  ));
  TableHeader.displayName = 'TableHeader';

  // Render empty state component
  const EmptyState = memo(() => (
    <div className="p-8 text-center">
      <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
        <AddIcon />
      </div>
      <p className="text-sm text-blueGray-600 mb-4">No transactions yet</p>
      <Link
        href="/dashboard/transactions/new"
        className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
      >
        Add your first transaction
      </Link>
    </div>
  ));
  EmptyState.displayName = 'EmptyState';

  // Render a static placeholder first to improve LCP
  // Then replace with dynamic content when data is loaded
  // Log categories and transactions for debugging
  useEffect(() => {
    if (categories) {
      console.log('Categories loaded:', categories.length, 'items');
    }
    if (recentTransactions && recentTransactions.length > 0) {
      console.log('Recent transactions with categoryIds:', 
        recentTransactions.map(t => ({ 
          id: t.id, 
          description: t.description, 
          categoryId: t.categoryId 
        })));
    }
  }, [categories, recentTransactions]);

  return (
    <div className="px-0" style={{height: '250px', contain: 'size layout'}}>
      {isLoading || categoriesLoading ? (
        <div className="p-4" style={{height: '250px', contain: 'size layout'}}>
          {/* Single skeleton with fixed height to prevent layout shift */}
          <TransactionTableSkeleton />
        </div>
      ) : recentTransactions.length > 0 ? (
        <div className="block w-full overflow-x-auto" style={{height: '250px', contain: 'size layout'}}>
          <table className="items-center w-full bg-transparent border-collapse">
            <TableHeader />
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-blueGray-200 hover:bg-blueGray-50">
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${transaction.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-500' : 'bg-red-100 text-red-500'}`}>
                        {transaction.type === TransactionType.INCOME ? <IncomeIcon /> : <ExpenseIcon />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blueGray-700">{transaction.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {formatDate(new Date(transaction.date))}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <span className="px-2 py-1 text-xs rounded-full font-semibold bg-blueGray-100 text-blueGray-700">
                      {transaction.categoryId || transaction.category ? getCategoryName(transaction.categoryId || transaction.category) : 'No category'}
                    </span>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                    <span className={`font-semibold ${transaction.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-red-500'}`}>
                      {transaction.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{height: '250px', contain: 'size layout'}}>
          <EmptyState />
        </div>
      )}
    </div>
  );
}
