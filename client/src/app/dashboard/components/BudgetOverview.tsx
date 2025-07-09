'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ApiBudgetRepository } from '../../../adapters/repositories/BudgetRepository';
import { ApiCategoryRepository } from '../../../adapters/repositories/CategoryRepository';
import { ApiTransactionRepository } from '../../../adapters/repositories/TransactionRepository';
import { TransactionType } from '../../../domain/entities/Transaction';
import { formatCurrency } from '../../../lib/utils/formatters';

interface BudgetOverviewProps {
  userId: string;
}

export default function BudgetOverview({ userId }: BudgetOverviewProps) {
  const budgetRepository = new ApiBudgetRepository();
  const transactionRepository = new ApiTransactionRepository();
  const categoryRepository = new ApiCategoryRepository();
  
  // Get active budgets for the user
  const { data: budgets, isLoading: isLoadingBudgets } = useQuery({
    queryKey: ['budgets', userId],
    queryFn: async () => {
      // The interface expects userId and date parameters
      return await budgetRepository.findActive(userId, new Date());
    },
    enabled: !!userId,
  });

  // Get all transactions for the user
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      // The interface expects userId parameter
      return await transactionRepository.findByUserId(userId);
    },
    enabled: !!userId,
  });

  // Get all categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // This method doesn't need parameters
      return await categoryRepository.findAll();
    },
  });

  // Calculate budget progress
  const calculateBudgetProgress = (budgetId: string, category: string) => {
    if (!transactions) return 0;
    
    const budget = budgets?.find(b => b.id === budgetId);
    if (!budget) return 0;
    
    const categoryTransactions = transactions.filter(
      t => t.category === category && 
      t.type === TransactionType.EXPENSE &&
      new Date(t.date) >= new Date(budget.startDate as string) &&
      new Date(t.date) <= new Date(budget.endDate as string)
    );
    
    const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return Math.min(100, Math.round((spent / (budget.amount as number)) * 100));
  };

  const isLoading = isLoadingBudgets || isLoadingTransactions || isLoadingCategories;

  return (
    <div className="px-0">
      {isLoading ? (
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse h-16 bg-blueGray-100 rounded"></div>
          ))}
        </div>
      ) : budgets && budgets.length > 0 ? (
        <div className="p-4 space-y-4">
          {budgets.slice(0, 3).map((budget) => {
            const budgetId = budget.id as string;
            const categoryId = budget.category as string;
            const amount = budget.amount as number;
            const progress = calculateBudgetProgress(budgetId, categoryId);
            
            // Find the category object to get the name
            const categoryObj = categories?.find(c => c.id === categoryId);
            const categoryName = categoryObj?.name || categoryId; // Fallback to ID if name not found
            
            // Determine color based on progress
            let progressColor = '';
            if (progress < 70) {
              progressColor = 'bg-emerald-500';
            } else if (progress < 90) {
              progressColor = 'bg-orange-500';
            } else {
              progressColor = 'bg-red-500';
            }
            
            return (
              <div key={budgetId} className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      {categoryName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {formatCurrency(progress * amount / 100)} / {formatCurrency(amount)}
                    </span>
                  </div>
                </div>
                <div className="flex mb-2 items-center justify-between">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="w-full">
                        <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blueGray-200 rounded-full">
                          <div
                            className={`text-xs font-bold text-center text-white justify-center p-0.5 rounded-full ${progressColor}`}
                            style={{ width: `${progress}%` }}
                          >
                            {progress > 15 && `${progress}%`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-sm text-blueGray-600 mb-4">No budgets set up yet</p>
          <Link
            href="/dashboard/budgets/new"
            className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            Create your first budget
          </Link>
        </div>
      )}
    </div>
  );
}
