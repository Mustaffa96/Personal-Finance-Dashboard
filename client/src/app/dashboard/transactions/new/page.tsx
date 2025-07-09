'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useCategories } from '../../hooks/useCategories';
import { CategoryType } from '../../../../domain/entities/Category';
import { ApiTransactionRepository } from '../../../../adapters/repositories/TransactionRepository';
import { TransactionType } from '../../../../domain/entities/Transaction';

// Transaction schema for validation
const transactionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.string().min(1, 'Amount is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['income', 'expense']),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;



export default function NewTransactionPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryType, setCategoryType] = useState<CategoryType>(CategoryType.EXPENSE);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0], // Today's date
    }
  });
  
  const transactionType = watch('type');
  
  // Fetch categories based on the selected transaction type
  const { data: categories, isLoading: isCategoriesLoading } = useCategories(categoryType);
  
  // Update category type when transaction type changes
  useEffect(() => {
    const newCategoryType = transactionType === 'income' ? CategoryType.INCOME : CategoryType.EXPENSE;
    setCategoryType(newCategoryType);
    
    // Clear the selected category when type changes
    setValue('category', '');
  }, [transactionType, setValue]);
  
  const onSubmit = async (data: TransactionFormValues) => {
    if (!session?.user?.id) {
      console.error('User not authenticated');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert amount to number
      const amountValue = parseFloat(data.amount);
      const finalAmount = Math.abs(amountValue); // Always store positive amount

      // Create transaction repository
      const transactionRepository = new ApiTransactionRepository();

      // Create transaction
      await transactionRepository.create({
        userId: session.user.id,
        description: data.description,
        amount: finalAmount,
        category: data.category, // Using category ID from the Category entity
        type: data.type === 'income' ? TransactionType.INCOME : TransactionType.EXPENSE,
        date: new Date(data.date),
        notes: data.notes || undefined,
      });

      // Redirect back to transactions list
      router.push('/dashboard/transactions');
      router.refresh();
    } catch (error) {
      console.error('Failed to create transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Add Transaction</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 ">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Transaction Type */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register('type')}
                    value="expense"
                    className="form-radio h-4 w-4 text-primary-600"
                  />
                  <span className="ml-2 text-gray-700">Expense</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register('type')}
                    value="income"
                    className="form-radio h-4 w-4 text-primary-600"
                  />
                  <span className="ml-2 text-gray-700">Income</span>
                </label>
              </div>
            </div>
            
            {/* Description */}
            <div>
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
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                {...register('category')}
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
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
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
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
