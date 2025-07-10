'use client';

// Add priority loading hint
export const runtime = 'edge';
export const preferredRegion = 'auto';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ApiBudgetRepository } from '../../../adapters/repositories/BudgetRepository';
import { ApiCategoryRepository } from '../../../adapters/repositories/CategoryRepository';
import { ApiTransactionRepository } from '../../../adapters/repositories/TransactionRepository';
import { TransactionType } from '../../../domain/entities/Transaction';
import { formatCurrency } from '../../../lib/utils/formatters';
import { useEffect, useState, memo } from 'react';

// Memoized AddIcon component to avoid re-renders
const AddIcon = memo(() => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
});

AddIcon.displayName = 'AddIcon';

interface BudgetOverviewProps {
  userId: string;
}

// Create a loading placeholder component for better UX during loading
const BudgetSkeleton = memo(() => {
  return (
    <div className="animate-pulse p-4" style={{height: '80px', contain: 'size layout'}}>
      <div className="flex mb-2 items-center justify-between">
        <div className="h-6 bg-blueGray-200 rounded w-24"></div>
        <div className="h-6 bg-blueGray-200 rounded w-32"></div>
      </div>
      <div className="h-4 bg-blueGray-200 rounded-full w-full mt-2"></div>
      <div className="h-4 bg-blueGray-200 rounded-full w-full mt-2" style={{width: '75%'}}></div>
    </div>
  );
});

BudgetSkeleton.displayName = 'BudgetSkeleton';

// Memoized empty state component
const EmptyState = memo(() => {
  return (
    <div className="p-8 text-center" style={{height: '250px', contain: 'size layout'}}>
      <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center" style={{aspectRatio: '1/1'}}>
        <AddIcon />
      </div>
      <p className="text-sm text-blueGray-600 mb-4">No budgets set up yet</p>
      <Link
        href="/dashboard/budgets/new"
        className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
      >
        Create your first budget
      </Link>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

export default function BudgetOverview({ userId }: BudgetOverviewProps) {
  const budgetRepository = new ApiBudgetRepository();
  const transactionRepository = new ApiTransactionRepository();
  const categoryRepository = new ApiCategoryRepository();
  
  // State for tracking if component is mounted (for deferred loading)
  const [isMounted, setIsMounted] = useState(false);
  
  // Use effect to defer non-critical data loading
  useEffect(() => {
    // Small delay to prioritize critical content first
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Get active budgets for the user with deferred loading
  const { data: budgets, isLoading: isLoadingBudgets } = useQuery({
    queryKey: ['budgets', userId],
    queryFn: async () => {
      return await budgetRepository.findActive(userId, new Date());
    },
    enabled: !!userId && isMounted,
    staleTime: 60 * 1000, // 1 minute
  });

  // Get all transactions for the user with deferred loading
  const { data: transactions } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      return await transactionRepository.findByUserId(userId);
    },
    enabled: !!userId && isMounted,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Get all categories with deferred loading
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return await categoryRepository.findAll();
    },
    enabled: isMounted,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Calculate budget progress and total category spending
  const calculateBudgetProgress = (budgetId: string, categoryId: string): { percentage: number; spent: number; totalCategorySpent: number; isFinished: boolean } => {
    if (!transactions) return { percentage: 0, spent: 0, totalCategorySpent: 0, isFinished: false };
    
    // Find the budget
    const budget = budgets?.find(b => b.id === budgetId);
    if (!budget) return { percentage: 0, spent: 0, totalCategorySpent: 0, isFinished: false };
    
    // Check if budget period has ended
    const currentDate = new Date();
    // Always create a new Date object for consistent comparison
    const endDate = new Date(budget.endDate instanceof Date ? budget.endDate : budget.endDate as string);
    const budgetStartDate = new Date(budget.startDate instanceof Date ? budget.startDate : budget.startDate as string);
    const isFinished = currentDate > endDate;
    
    // Log budget information for debugging
    console.log(`Budget ${budgetId} period: ${budgetStartDate.toISOString()} to ${endDate.toISOString()}`);
    console.log(`Budget ${budgetId} amount: ${budget.amount}, category: ${categoryId}`);
    
    // Log all transactions for debugging
    console.log(`All transactions:`, transactions.map(t => ({
      id: t.id,
      description: t.description,
      amount: t.amount,
      categoryId: t.categoryId,
      date: new Date(t.date).toISOString(),
      type: t.type
    })));
    
    // Filter transactions for this budget's category and date range
    const relevantTransactions = transactions.filter(t => {
      // Check transaction type first - we only want expenses for budget tracking
      if (t.type !== TransactionType.EXPENSE) {
        return false;
      }
      
      // Make sure we're comparing the same category ID format
      const transactionCategoryId = t.categoryId;
      
      // Check category match first
      const categoryMatches = transactionCategoryId === categoryId;
      if (!categoryMatches) {
        return false;
      }
      
      // Parse transaction date once to avoid multiple conversions
      // Always create a new Date object for consistent comparison
      const transactionDate = new Date(t.date);
      
      // Check date range - ensure proper date comparison
      // Use getTime() for numeric comparison to avoid any object reference issues
      const inDateRange = 
        transactionDate.getTime() >= budgetStartDate.getTime() && 
        transactionDate.getTime() <= endDate.getTime();
      
      // Debug logging for matching category transactions
      console.log(`Transaction: ${t.description}, Date: ${transactionDate.toISOString()}, Amount: ${t.amount}, Category: ${transactionCategoryId}`);
      console.log(`Date comparison result: ${inDateRange}`);
      
      return categoryMatches && inDateRange;
    });
    
    // Filter all transactions for this category (regardless of date)
    const allCategoryTransactions = transactions.filter(t => {
      return t.categoryId === categoryId && t.type === TransactionType.EXPENSE;
    });
    
    // Log filtered transactions for debugging
    console.log(`Relevant transactions for budget ${budgetId}:`, relevantTransactions.map(t => ({
      description: t.description,
      amount: t.amount,
      date: new Date(t.date).toISOString()
    })));
    
    console.log(`Budget ${budgetId} category ${categoryId} has ${relevantTransactions.length} transactions in budget period`);
    console.log(`Category ${categoryId} has ${allCategoryTransactions.length} total transactions`);
    
    // Sum up the expenses for budget period
    const totalSpent = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
    console.log(`Total spent in budget period: ${totalSpent} from ${relevantTransactions.length} transactions`);
    
    // Sum up all expenses for this category
    const totalCategorySpent = allCategoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate percentage of budget used based on total category spending
    const percentage = Math.min(Math.round((totalCategorySpent / (budget.amount as number)) * 100), 100);
    
    console.log(`Budget ${budgetId} progress: ${percentage}%, spent: ${totalSpent}, total category spent: ${totalCategorySpent}`);
    
    return { percentage, spent: totalSpent, totalCategorySpent, isFinished };
  };

  // Define the props for the BudgetItem component
  interface BudgetItemProps {
    budget: {
      id: string;
      categoryId: string;
      amount: number;
      startDate: string;
      endDate: string;
      userId?: string;
      period?: string;
      createdAt?: Date;
      updatedAt?: Date;
    };
    categories?: { id: string; name: string }[];
    calculateProgress: (budgetId: string, categoryId: string) => { percentage: number; spent: number; totalCategorySpent: number; isFinished: boolean };
  }

  // Memoized budget item component to avoid re-renders
  const BudgetItem = memo(({ budget, categories, calculateProgress }: BudgetItemProps) => {
    // Find the category name from the categories array
    const categoryObj = categories?.find(cat => cat.id === budget.categoryId);
    const categoryName = categoryObj?.name || 'Unknown Category';
    
    // Calculate progress
    const { percentage, spent, totalCategorySpent, isFinished } = calculateProgress(budget.id, budget.categoryId);
    
    // Get amount from budget
    const { amount } = budget;
    
    // Determine color based on percentage
    let progressColor = '';
    if (percentage >= 100) {
      progressColor = 'bg-red-500';
    } else if (percentage >= 75) {
      progressColor = 'bg-yellow-500';
    } else {
      progressColor = 'bg-green-500';
    }
    
    return (
      <div className="relative pt-1" style={{height: '110px', contain: 'size layout'}}>
        <div className="flex mb-2 items-center justify-between">
          <div className="flex items-center">
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              {categoryName}
            </span>
            {isFinished && (
              <span className="ml-2 text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-gray-500">
                FINISHED
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {formatCurrency(spent)} / {formatCurrency(amount)}
            </span>
          </div>
        </div>
        <div className="flex mb-2 items-center justify-between">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="w-full">
                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blueGray-200 rounded-full" style={{height: '20px', contain: 'strict'}}>
                  <div
                    className={`text-xs font-bold text-center text-white justify-center p-0.5 rounded-full ${progressColor}`}
                    style={{ width: `${percentage}%`, height: '20px' }}
                  >
                    {percentage > 15 && `${formatCurrency(spent)}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <div className="text-xs text-gray-600">
            Total spent in this category: 
          </div>
          <div className="text-xs font-semibold text-gray-800">
            {formatCurrency(totalCategorySpent)}
          </div>
        </div>
        <div className="flex mt-1 items-center justify-between">
          <div className="text-xs text-gray-600">
            Period: 
          </div>
          <div className="text-xs font-semibold text-gray-800">
            {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  });
  
  BudgetItem.displayName = 'BudgetItem';

  // Render a static placeholder first to improve LCP
  // Then replace with dynamic content when data is loaded
  return (
    <div className="px-0" style={{contain: 'content', minHeight: '250px'}}>
      {isLoadingBudgets ? (
        <div className="p-4 space-y-3" style={{height: '250px', contain: 'size layout'}}>
          {/* Better loading skeletons that match the actual content shape */}
          {[...Array(3)].map((_, i) => (
            <BudgetSkeleton key={i} />
          ))}
        </div>
      ) : budgets && budgets.length > 0 ? (
        <div className="p-4 space-y-4" style={{minHeight: '250px', contain: 'content'}}>
          {budgets.slice(0, 3).map((budget) => (
            <BudgetItem 
              key={budget.id as string}
              budget={{
                id: budget.id as string,
                categoryId: budget.categoryId as string,
                amount: budget.amount as number,
                startDate: budget.startDate instanceof Date ? budget.startDate.toISOString() : budget.startDate as string,
                endDate: budget.endDate instanceof Date ? budget.endDate.toISOString() : budget.endDate as string,
                userId: budget.userId as string,
                period: budget.period as string,
                createdAt: budget.createdAt as Date,
                updatedAt: budget.updatedAt as Date
              }}
              categories={categories?.map(cat => ({
                id: cat.id as string,
                name: cat.name
              }))}
              calculateProgress={calculateBudgetProgress}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
