'use client';


import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { CategoryType } from '../../../../../domain/entities/Category';
import { BudgetPeriod } from '../../../../../domain/entities/Budget';
import { useCreateBudget } from '@/hooks/useBudgets';
import { useCategories } from '@/app/dashboard/hooks/useCategories';

// Budget schema for validation
const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.string().min(1, 'Amount is required'),
  period: z.enum(['monthly', 'quarterly', 'yearly']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  notes: z.string().optional(),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

export default function CreateBudgetClient() {
  const router = useRouter();
  const { data: session } = useSession() as { data: Session | null };
  const { mutate: createBudget, isPending } = useCreateBudget();
  // State is managed through form values instead of separate state
  // Fetch expense categories for the dropdown
  const { data: categories, isLoading: categoriesLoading } = useCategories(CategoryType.EXPENSE);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0], // Today's date
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0], // End of current month
    }
  });
  
  const onSubmit = async (data: BudgetFormValues) => {
    if (!session?.user?.id) {
      console.error('User not authenticated');
      toast.error('You must be logged in to create a budget');
      return;
    }
    
    try {
      // Convert amount to number
      const amountValue = parseFloat(data.amount);
      
      if (isNaN(amountValue) || amountValue <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }
      
      // Validate start date is before end date
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      
      if (startDate >= endDate) {
        toast.error('Start date must be before end date');
        return;
      }
      
      // Prepare budget data
      const budgetData = {
        categoryId: data.categoryId,
        amount: amountValue,
        period: data.period,
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes || undefined
      };
      
      // Use React Query mutation
      createBudget(budgetData, {
        onSuccess: () => {
          toast.success('Budget created successfully');
          router.push('/dashboard/budgets');
          router.refresh();
        },
        onError: (error) => {
          console.error('Error creating budget:', error);
          toast.error('Failed to create budget. Please try again.');
        }
      });
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Create New Budget</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white shadow rounded-lg pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Budget Period */}
            <div>
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                Budget Period
              </label>
              <select
                id="period"
                {...register('period')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                onChange={(e) => {
                  setValue('period', e.target.value as BudgetPeriod);
                  // Period is managed through form values
                }}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              {errors.period && (
                <p className="mt-1 text-sm text-red-600">{errors.period.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Budget Category
              </label>
              <select
                id="categoryId"
                {...register('categoryId')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                disabled={categoriesLoading}
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
              {categoriesLoading && (
                <p className="mt-1 text-sm text-gray-500">Loading categories...</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Budget Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('amount')}
                  className="block w-full pl-7 pr-12 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                {...register('endDate')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
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
                placeholder="Add any notes about this budget"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className={`px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors ${
                isPending ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isPending ? 'Creating...' : 'Create Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
