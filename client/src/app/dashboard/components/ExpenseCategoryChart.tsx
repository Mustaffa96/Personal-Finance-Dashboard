'use client';

import { useQuery } from '@tanstack/react-query';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { ApiTransactionRepository } from '../../../adapters/repositories/TransactionRepository';
import { ApiCategoryRepository } from '../../../adapters/repositories/CategoryRepository';
import { TransactionType } from '../../../domain/entities/Transaction';
import { useState } from 'react';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseCategoryChartProps {
  userId: string;
}

export default function ExpenseCategoryChart({ userId }: ExpenseCategoryChartProps) {
  const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');
  
  const transactionRepository = new ApiTransactionRepository();
  const categoryRepository = new ApiCategoryRepository();
  
  // Get all transactions for the user
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => transactionRepository.findByUserId(userId),
    enabled: !!userId,
  });

  // Get all categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryRepository.findAll(),
  });

  const isLoading = isLoadingTransactions || isLoadingCategories;

  // Filter transactions by timeframe and type (expenses only)
  const getFilteredTransactions = () => {
    if (!transactions) return [];
    
    const now = new Date();
    const startDate = new Date();
    
    if (timeframe === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    return transactions.filter(
      t => t.type === TransactionType.EXPENSE &&
      new Date(t.date) >= startDate
    );
  };

  // Group transactions by category and calculate totals
  const getCategoryData = () => {
    const filteredTransactions = getFilteredTransactions();
    const categoryTotals: Record<string, number> = {};
    
    filteredTransactions.forEach(transaction => {
      const categoryId = transaction.category;
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0;
      }
      categoryTotals[categoryId] += transaction.amount;
    });
    
    return categoryTotals;
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!categories || isLoading) return null;
    
    const categoryTotals = getCategoryData();
    const categoryIds = Object.keys(categoryTotals);
    
    const labels = categoryIds.map(id => {
      const category = categories.find(c => c.id === id);
      return category?.name || id;
    });
    
    const data = categoryIds.map(id => categoryTotals[id]);
    
    // Get colors from category data if available, otherwise use defaults
    const backgroundColors = categoryIds.map(id => {
      const category = categories.find(c => c.id === id);
      return category?.color || getRandomColor(id);
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Expenses by Category',
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => adjustColor(color, -20)),
          borderWidth: 1,
        },
      ],
    };
  };

  // Helper function to generate consistent random colors based on string
  const getRandomColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  // Helper function to adjust color brightness
  const adjustColor = (color: string, amount: number) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => {
      const num = Math.min(255, Math.max(0, parseInt(color, 16) + amount));
      return ('0' + num.toString(16)).substr(-2);
    });
  };

  const chartData = prepareChartData();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 text-xs rounded-full ${
              timeframe === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-blueGray-200 text-blueGray-700 hover:bg-blueGray-300'
            } transition-colors duration-200`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1 text-xs rounded-full ${
              timeframe === 'year'
                ? 'bg-blue-500 text-white'
                : 'bg-blueGray-200 text-blueGray-700 hover:bg-blueGray-300'
            } transition-colors duration-200`}
          >
            Year
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="animate-pulse h-64 bg-blueGray-100 rounded"></div>
      ) : chartData && chartData.datasets[0].data.length > 0 ? (
        <div className="relative h-350-px">
          <Pie 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    boxWidth: 12,
                    padding: 15,
                    font: {
                      size: 11,
                      family: "'Open Sans', sans-serif"
                    },
                    color: '#8898aa'
                  }
                },
                tooltip: {
                  backgroundColor: '#fff',
                  titleColor: '#8898aa',
                  bodyColor: '#525f7f',
                  borderColor: '#e9ecef',
                  borderWidth: 1,
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw as number;
                      const total = (context.chart.data.datasets[0].data as number[]).reduce((a, b) => (a as number) + (b as number), 0);
                      const percentage = Math.round(value / (total as number) * 100);
                      return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm text-blueGray-600">No expense data available</p>
        </div>
      )}
    </>
  );
}
