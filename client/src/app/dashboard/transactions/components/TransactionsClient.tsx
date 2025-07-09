'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiTransactionRepository } from '../../../../adapters/repositories/TransactionRepository';
import { ApiCategoryRepository } from '../../../../adapters/repositories/CategoryRepository';
import { TransactionType } from '../../../../domain/entities/Transaction';
import { formatCurrency, formatDate } from '../../../../lib/utils/formatters';
import Link from 'next/link';

interface TransactionsClientProps {
  userId: string;
}

export default function TransactionsClient({ userId }: TransactionsClientProps) {
  const transactionRepository = new ApiTransactionRepository();
  const categoryRepository = new ApiCategoryRepository();
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');
  
  // Get all transactions for the user
  const { data: transactions, isLoading, isError } = useQuery({
    queryKey: ['transactions', userId, filter],
    queryFn: async () => {
      if (filter === 'all') {
        return transactionRepository.findByUserId(userId);
      } else {
        return transactionRepository.findByUserIdAndType(userId, filter as TransactionType);
      }
    },
    enabled: !!userId,
  });

  // Get all categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return categoryRepository.findAll();
    },
  });

  // Function to get category name by ID
  const getCategoryName = (categoryId: string): string => {
    if (!categories) return categoryId;
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4">
        <p>Error loading transactions. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Link 
          href="/dashboard/transactions/new" 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Add Transaction
        </Link>
      </div>
      
      <div className="flex space-x-2 mb-4 pt-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter(TransactionType.INCOME)}
          className={`px-4 py-2 rounded-md ${
            filter === TransactionType.INCOME 
              ? 'bg-accent-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setFilter(TransactionType.EXPENSE)}
          className={`px-4 py-2 rounded-md ${
            filter === TransactionType.EXPENSE 
              ? 'bg-secondary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Expenses
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            Loading transactions...
                          </td>
                        </tr>
                      ) : transactions && transactions.length > 0 ? (
                        transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(new Date(transaction.date))}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getCategoryName(transaction.category)}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                              transaction.type === TransactionType.INCOME ? 'text-accent-600' : 'text-secondary-600'
                            }`}>
                              {transaction.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(transaction.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.type === TransactionType.INCOME 
                                  ? 'bg-accent-100 text-accent-800' 
                                  : 'bg-secondary-100 text-secondary-800'
                              }`}>
                                {transaction.type === TransactionType.INCOME ? 'Income' : 'Expense'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link 
                                href={`/dashboard/transactions/${transaction.id}`}
                                className="text-primary-600 hover:text-primary-900 mr-4"
                              >
                                View
                              </Link>
                              <Link 
                                href={`/dashboard/transactions/${transaction.id}/edit`}
                                className="text-primary-600 hover:text-primary-900"
                              >
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center">
                            <div className="text-center">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="mx-auto h-12 w-12 text-gray-400" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                                />
                              </svg>
                              <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
                              <p className="mt-1 text-sm text-gray-500">Get started by creating a new transaction.</p>
                              <div className="mt-6">
                                <Link
                                  href="/dashboard/transactions/new"
                                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  <svg 
                                    className="-ml-1 mr-2 h-5 w-5" 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor" 
                                    aria-hidden="true"
                                  >
                                    <path 
                                      fillRule="evenodd" 
                                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
                                      clipRule="evenodd" 
                                    />
                                  </svg>
                                  Add Transaction
                                </Link>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
