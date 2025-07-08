'use client';

import { useState, useEffect } from 'react';

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

interface BudgetProgressProps {
  showAll?: boolean;
}

export default function BudgetProgress({ showAll = false }: BudgetProgressProps) {
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const mockBudgets: BudgetCategory[] = [
      {
        id: '1',
        name: 'Housing',
        budgeted: 1500,
        spent: 1200,
        color: 'bg-blue-500',
      },
      {
        id: '2',
        name: 'Food',
        budgeted: 500,
        spent: 450,
        color: 'bg-green-500',
      },
      {
        id: '3',
        name: 'Transportation',
        budgeted: 250,
        spent: 200,
        color: 'bg-yellow-500',
      },
      {
        id: '4',
        name: 'Utilities',
        budgeted: 200,
        spent: 150,
        color: 'bg-purple-500',
      },
      {
        id: '5',
        name: 'Entertainment',
        budgeted: 100,
        spent: 120,
        color: 'bg-red-500',
      },
      {
        id: '6',
        name: 'Shopping',
        budgeted: 200,
        spent: 140,
        color: 'bg-pink-500',
      },
      {
        id: '7',
        name: 'Healthcare',
        budgeted: 150,
        spent: 50,
        color: 'bg-indigo-500',
      },
    ];

    setTimeout(() => {
      setBudgets(showAll ? mockBudgets : mockBudgets.slice(0, 4));
      setLoading(false);
    }, 500);
  }, [showAll]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(showAll ? 7 : 4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {budgets.map((budget) => {
        const percentage = Math.min(Math.round((budget.spent / budget.budgeted) * 100), 100);
        const isOverBudget = budget.spent > budget.budgeted;
        
        return (
          <div key={budget.id}>
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium text-gray-700">{budget.name}</div>
              <div className="text-sm text-gray-500">
                ${budget.spent.toFixed(2)} / ${budget.budgeted.toFixed(2)}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  isOverBudget ? 'bg-red-500' : budget.color
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-gray-500">{percentage}% used</div>
              {isOverBudget && (
                <div className="text-xs text-red-500 font-medium">
                  Over budget by ${(budget.spent - budget.budgeted).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
