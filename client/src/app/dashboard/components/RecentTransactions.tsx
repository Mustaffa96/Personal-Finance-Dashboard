'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ApiTransactionRepository } from '../../../adapters/repositories/TransactionRepository';
import { ApiCategoryRepository } from '../../../adapters/repositories/CategoryRepository';
import { TransactionType } from '../../../domain/entities/Transaction';
import { formatCurrency, formatDate } from '../../../lib/utils/formatters';

interface RecentTransactionsProps {
  userId: string;
}

export default function RecentTransactions({ userId }: RecentTransactionsProps) {
  const transactionRepository = new ApiTransactionRepository();
  const categoryRepository = new ApiCategoryRepository();
  
  // Get all transactions for the user
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => transactionRepository.findByUserId(userId),
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

  // Get the 5 most recent transactions
  const recentTransactions = transactions
    ? [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
    : [];

  return (
    <div className="px-0">
      {isLoading ? (
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse h-16 bg-blueGray-100 rounded"></div>
          ))}
        </div>
      ) : recentTransactions.length > 0 ? (
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
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
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-blueGray-200 hover:bg-blueGray-50">
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${transaction.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-500' : 'bg-red-100 text-red-500'}`}>
                        {transaction.type === TransactionType.INCOME ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                          </svg>
                        )}
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
                      {getCategoryName(transaction.category)}
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
        <div className="p-8 text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-sm text-blueGray-600 mb-4">No transactions yet</p>
          <Link
            href="/dashboard/transactions/new"
            className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
          >
            Add your first transaction
          </Link>
        </div>
      )}
    </div>
  );
}
