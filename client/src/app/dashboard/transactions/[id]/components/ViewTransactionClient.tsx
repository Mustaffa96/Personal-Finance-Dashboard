'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiTransactionRepository } from '../../../../../adapters/repositories/TransactionRepository';
import { ApiCategoryRepository } from '../../../../../adapters/repositories/CategoryRepository';
import { TransactionType } from '../../../../../domain/entities/Transaction';
import { formatCurrency, formatDate } from '../../../../../lib/utils/formatters';
import Link from 'next/link';

interface ViewTransactionClientProps {
  userId: string;
  transactionId: string;
}

export default function ViewTransactionClient({ userId, transactionId }: ViewTransactionClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const transactionRepository = new ApiTransactionRepository();
  const categoryRepository = new ApiCategoryRepository();
  const [isDeleting, setIsDeleting] = useState(false);
  
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
  
  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return categoryRepository.findAll();
    },
  });
  
  // Delete transaction mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return transactionRepository.delete(transactionId);
    },
    onSuccess: () => {
      // Invalidate and refetch transactions
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      router.push('/dashboard/transactions');
    },
  });
  
  // Function to get category name by ID
  const getCategoryName = (categoryId: string): string => {
    if (!categories) return categoryId;
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  // Handle delete transaction
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        setIsDeleting(false);
      }
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
        <p>Error loading transaction details. The transaction may not exist or you don&apos;t have permission to view it.</p>
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
        <p>You don&apos;t have permission to view this transaction.</p>
        <Link href="/dashboard/transactions" className="mt-4 inline-block text-primary-600 hover:underline">
          Back to Transactions
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
        <div className="flex space-x-2">
          <Link 
            href="/dashboard/transactions" 
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Back
          </Link>
          <Link 
            href={`/dashboard/transactions/${transactionId}/edit`} 
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
              isDeleting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{transaction.description}</h2>
              <p className="text-sm text-gray-500">
                {formatDate(new Date(transaction.date))}
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                transaction.type === TransactionType.INCOME 
                  ? 'bg-accent-100 text-accent-800' 
                  : 'bg-secondary-100 text-secondary-800'
              }`}>
                {transaction.type === TransactionType.INCOME ? 'Income' : 'Expense'}
              </span>
              <p className={`text-2xl font-bold ${
                transaction.type === TransactionType.INCOME ? 'text-accent-600' : 'text-secondary-600'
              }`}>
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="mt-1 text-base text-gray-900">{getCategoryName(transaction.categoryId || '')}</p>
            </div>
            
            {transaction.notes && (
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                <p className="mt-1 text-base text-gray-900 whitespace-pre-wrap">{transaction.notes}</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p>Created: {transaction.createdAt ? formatDate(new Date(transaction.createdAt)) : 'N/A'}</p>
              </div>
              <div className="text-right">
                <p>Last Updated: {transaction.updatedAt ? formatDate(new Date(transaction.updatedAt)) : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
