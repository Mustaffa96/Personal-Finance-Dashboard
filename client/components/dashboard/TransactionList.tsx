'use client';

import { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

interface TransactionListProps {
  limit?: number;
  filter?: string;
}

export default function TransactionList({ limit, filter }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    let mockTransactions: Transaction[] = [
      {
        id: '1',
        date: '2025-07-05',
        description: 'Salary',
        category: 'Income',
        amount: 3500,
        type: 'income',
      },
      {
        id: '2',
        date: '2025-07-04',
        description: 'Grocery Shopping',
        category: 'Food',
        amount: 120.45,
        type: 'expense',
      },
      {
        id: '3',
        date: '2025-07-03',
        description: 'Netflix Subscription',
        category: 'Entertainment',
        amount: 14.99,
        type: 'expense',
      },
      {
        id: '4',
        date: '2025-07-02',
        description: 'Electricity Bill',
        category: 'Utilities',
        amount: 85.20,
        type: 'expense',
      },
      {
        id: '5',
        date: '2025-07-01',
        description: 'Freelance Work',
        category: 'Income',
        amount: 450,
        type: 'income',
      },
      {
        id: '6',
        date: '2025-06-30',
        description: 'Restaurant Dinner',
        category: 'Food',
        amount: 65.80,
        type: 'expense',
      },
      {
        id: '7',
        date: '2025-06-28',
        description: 'Gas',
        category: 'Transportation',
        amount: 45.30,
        type: 'expense',
      },
    ];

    // Filter transactions if filter prop is provided
    if (filter) {
      mockTransactions = mockTransactions.filter(transaction => transaction.type === filter);
    }

    setTimeout(() => {
      setTransactions(limit ? mockTransactions.slice(0, limit) : mockTransactions);
      setLoading(false);
    }, 500);
  }, [limit, filter]);

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(limit || 5)].map((_, index) => (
          <div key={index} className="py-4 border-b border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
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
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {transaction.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  {transaction.category}
                </span>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
