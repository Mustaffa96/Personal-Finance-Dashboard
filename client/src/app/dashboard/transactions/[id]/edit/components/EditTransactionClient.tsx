'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCategories } from '../../../../hooks/useCategories';
import { CategoryType } from '../../../../../../domain/entities/Category';
import { ApiTransactionRepository } from '../../../../../../adapters/repositories/TransactionRepository';
import { TransactionType } from '../../../../../../domain/entities/Transaction';
import Link from 'next/link';

// Transaction schema for validation
const transactionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.string().min(1, 'Amount is required'),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['income', 'expense']),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface EditTransactionClientProps {
  userId: string;
  transactionId: string;
}

export default function EditTransactionClient({ userId, transactionId }: EditTransactionClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryType, setCategoryType] = useState<CategoryType>(CategoryType.EXPENSE);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const transactionRepository = new ApiTransactionRepository();
  
  // Fetch transaction details
  const { data: transaction, isLoading, isError } = useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => {
      const result = await transactionRepository.findById(transactionId);
      if (!result) {
        throw new Error('Transaction not found');
      }
      return result;
    },
    enabled: !!transactionId,
  });
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
    }
  });
  
  const transactionType = watch('type');
  
  // Fetch categories based on the selected transaction type
  const { data: categories, isLoading: isCategoriesLoading } = useCategories(categoryType);
  
  // Update form values when transaction data is loaded
  useEffect(() => {
    if (transaction && !isLoaded) {
      // Set the form values from the transaction data
      setValue('description', transaction.description);
      setValue('amount', transaction.amount.toString());
      setValue('categoryId', transaction.categoryId || '');
      setValue('type', transaction.type);
      setValue('date', new Date(transaction.date).toISOString().split('T')[0]);
      setValue('notes', transaction.notes || '');
      
      // Set the category type based on the transaction type
      setCategoryType(transaction.type === TransactionType.INCOME ? CategoryType.INCOME : CategoryType.EXPENSE);
      
      setIsLoaded(true);
    }
  }, [transaction, setValue, isLoaded]);
  
  // Update category type when transaction type changes
  useEffect(() => {
    const newCategoryType = transactionType === 'income' ? CategoryType.INCOME : CategoryType.EXPENSE;
    setCategoryType(newCategoryType);
    
    // Clear the selected category when type changes
    if (isLoaded && transaction?.type !== transactionType) {
      setValue('categoryId', '');
    }
  }, [transactionType, setValue, isLoaded, transaction]);
  
  // Update transaction mutation
  const updateMutation = useMutation({
    mutationFn: async (data: TransactionFormValues) => {
      // Convert amount to number
      const amountValue = parseFloat(data.amount);
      const finalAmount = Math.abs(amountValue); // Always store positive amount

      return transactionRepository.update(transactionId, {
        description: data.description,
        amount: finalAmount,
        categoryId: data.categoryId,
        type: data.type === 'income' ? TransactionType.INCOME : TransactionType.EXPENSE,
        date: new Date(data.date),
        notes: data.notes || undefined,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch transactions and the current transaction
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transaction', transactionId] });
      
      // Redirect back to transaction details
      router.push(`/dashboard/transactions/${transactionId}`);
    },
  });
  
  const onSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    
    try {
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error('Failed to update transaction:', error);
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (isError || !transaction) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4">
        <p>Error loading transaction details. The transaction may not exist or you don&apos;t have permission to edit it.</p>
        <Link href="/dashboard/transactions" className="mt-4 inline-block text-primary-600 hover:underline">
          Back to Transactions
        </Link>
      </div>
    );
  }
  
  // Check if the transaction belongs to the current user
  if (transaction.userId !== userId) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4">
        <p>You don&apos;t have permission to edit this transaction.</p>
        <Link href="/dashboard/transactions" className="mt-4 inline-block text-primary-600 hover:underline">
          Back to Transactions
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Transaction</h1>
        <div className="flex space-x-2">
          <Link
            href={`/dashboard/transactions/${transactionId}`}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Transaction Type */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="expense"
                    {...register('type')}
                    className="form-radio h-4 w-4 text-secondary-600 focus:ring-secondary-500"
                  />
                  <span className="ml-2 text-gray-700">Expense</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="income"
                    {...register('type')}
                    className="form-radio h-4 w-4 text-accent-600 focus:ring-accent-500"
                  />
                  <span className="ml-2 text-gray-700">Income</span>
                </label>
              </div>
            </div>
            
            {/* Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                id="description"
                type="text"
                {...register('description')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
            
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  {...register('amount')}
                  className="block w-full pl-7 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>
            
            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="categoryId"
                {...register('categoryId')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                disabled={isCategoriesLoading}
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
              )}
            </div>
            
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                id="date"
                type="date"
                {...register('date')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>
            
            {/* Notes */}
            <div className="col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                {...register('notes')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Update Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
