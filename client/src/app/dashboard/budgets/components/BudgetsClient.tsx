'use client';
import BudgetCard from '@/components/BudgetCard';
import { useQuery } from '@tanstack/react-query';
import { ApiTransactionRepository } from '@/adapters/repositories/TransactionRepository';
import { TransactionType, TransactionResponseDTO } from '@/domain/entities/Transaction';
import { useEffect, useState } from 'react';
import { ApiBudgetRepository } from '@/adapters/repositories/BudgetRepository';
import { BudgetResponseDTO } from '@/domain/entities/Budget';
import { ApiCategoryRepository } from '@/adapters/repositories/CategoryRepository';

// Map to assign colors to different categories
const categoryColorMap: Record<string, string> = {
  housing: 'indigo',
  transportation: 'green',
  food: 'blue',
  utilities: 'yellow',
  healthcare: 'purple',
  entertainment: 'red',
  education: 'indigo',
  personal: 'blue',
  debt: 'red',
  savings: 'green',
  income: 'blue',
  other: 'purple',
};

// Helper function to format category names for display
const formatCategoryName = (category: string): string => {
  // Handle both underscore and regular lowercase formats
  const parts = category.includes('_') ? category.split('_') : category.split(' ');
  return parts
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Helper function to calculate spent amount based on actual transaction data
const calculateSpentAmount = (budget: BudgetResponseDTO, transactions: TransactionResponseDTO[] | undefined): number => {
  if (!transactions) return 0;
  
  // Filter transactions for this budget's category and date range
  const relevantTransactions = transactions.filter(t => 
    t.categoryId === budget.categoryId && 
    t.type === TransactionType.EXPENSE &&
    new Date(t.date) >= new Date(budget.startDate) &&
    new Date(t.date) <= new Date(budget.endDate)
  );
  
  // Sum up the expenses
  return relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
};



export default function BudgetsClient() {
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
  
  // Initialize repositories
  const budgetRepository = new ApiBudgetRepository();
  const transactionRepository = new ApiTransactionRepository();
  const categoryRepository = new ApiCategoryRepository();
  
  // Fetch budgets using React Query
  const { data: budgets = [], isLoading: isLoadingBudgets, error, refetch } = useQuery({
    queryKey: ['budgets', 'active'],
    queryFn: async () => {
      // In a real app, you would get the userId from auth context
      // For now, we'll fetch all active budgets
      return await budgetRepository.findByUserId();
    },
    enabled: isMounted,
    staleTime: 30 * 1000, // 30 seconds
  });
  
  // Fetch transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      // In a real app, you would get the userId from auth context
      // For now, we'll fetch all transactions
      return await transactionRepository.findByUserId('');
    },
    enabled: isMounted,
    staleTime: 30 * 1000, // 30 seconds
  });
  
  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return await categoryRepository.findAll();
    },
    enabled: isMounted,
    staleTime: 60 * 1000, // 60 seconds
  });
  
  // Combined loading state
  const isLoading = isLoadingBudgets || isLoadingTransactions || isLoadingCategories;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mt-4">
        <p>Failed to load budgets. Please try again later.</p>
        <button 
          onClick={() => refetch()} 
          className="mt-2 text-sm underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center mt-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">No budgets found</h3>
        <p className="text-gray-500 mb-4">You haven&apos;t created any budgets yet.</p>
        <a 
          href="/dashboard/budgets/new" 
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Create Your First Budget
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
      {budgets.filter(budget => budget && budget.id).map((budget) => {
        const spent = calculateSpentAmount(budget, transactions);
        
        // Find category name from categories list
        const category = categories?.find(cat => cat.id === budget.categoryId);
        const categoryName = category?.name || 'Unknown';
        const color = categoryColorMap[categoryName.toLowerCase()] || 'blue';
        
        return (
          <BudgetCard 
            key={budget.id}
            categoryId={budget.categoryId}
            categoryName={formatCategoryName(categoryName)} 
            spent={spent} 
            limit={budget.amount} 
            color={color}
          />
        );
      })}
    </div>
  );
}
