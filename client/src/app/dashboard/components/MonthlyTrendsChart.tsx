'use client';

import { useQuery } from '@tanstack/react-query';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ApiTransactionRepository } from '../../../adapters/repositories/TransactionRepository';
import { TransactionType } from '../../../domain/entities/Transaction';
import { useState } from 'react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MonthlyTrendsChartProps {
  userId: string;
}

export default function MonthlyTrendsChart({ userId }: MonthlyTrendsChartProps) {
  const [timeframe, setTimeframe] = useState<'6months' | '12months'>('6months');
  
  const transactionRepository = new ApiTransactionRepository();
  
  // Get all transactions for the user
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => transactionRepository.findByUserId(userId),
    enabled: !!userId,
  });

  // Get months for the x-axis
  const getMonthLabels = () => {
    const months = [];
    const now = new Date();
    const monthCount = timeframe === '6months' ? 6 : 12;
    
    for (let i = monthCount - 1; i >= 0; i--) {
      const month = new Date(now);
      month.setMonth(now.getMonth() - i);
      // Use very short month format (first 3 letters only) to save space
      const monthStr = month.toLocaleString('default', { month: 'short' }).substring(0, 3);
      months.push(monthStr);
    }
    
    return months;
  };

  // Group transactions by month and type
  const getMonthlyData = () => {
    if (!transactions) return { income: [], expenses: [] };
    
    const now = new Date();
    const monthCount = timeframe === '6months' ? 6 : 12;
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - (monthCount - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    
    const filteredTransactions = transactions.filter(
      t => new Date(t.date) >= startDate
    );
    
    const monthlyIncome: number[] = Array(monthCount).fill(0);
    const monthlyExpenses: number[] = Array(monthCount).fill(0);
    
    filteredTransactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthDiff = (now.getMonth() - transactionDate.getMonth() + 12) % 12;
      
      if (monthDiff < monthCount) {
        const index = monthCount - 1 - monthDiff;
        
        if (transaction.type === TransactionType.INCOME) {
          monthlyIncome[index] += transaction.amount;
        } else {
          monthlyExpenses[index] += transaction.amount;
        }
      }
    });
    
    return { income: monthlyIncome, expenses: monthlyExpenses };
  };

  // Prepare chart data
  const prepareChartData = () => {
    const labels = getMonthLabels();
    const { income, expenses } = getMonthlyData();
    
    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: income,
          borderColor: '#5e72e4', // Argon blue
          backgroundColor: 'rgba(94, 114, 228, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#5e72e4',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
        {
          label: 'Expenses',
          data: expenses,
          borderColor: '#fb6340', // Argon orange
          backgroundColor: 'rgba(251, 99, 64, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#fb6340',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
      ],
    };
  };

  const chartData = prepareChartData();

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('6months')}
            className={`px-3 py-1 text-xs rounded-full ${
              timeframe === '6months'
                ? 'bg-blue-500 text-white'
                : 'bg-blueGray-200 text-blueGray-700 hover:bg-blueGray-300'
            } transition-colors duration-200`}
          >
            6 Months
          </button>
          <button
            onClick={() => setTimeframe('12months')}
            className={`px-3 py-1 text-xs rounded-full ${
              timeframe === '12months'
                ? 'bg-blue-500 text-white'
                : 'bg-blueGray-200 text-blueGray-700 hover:bg-blueGray-300'
            } transition-colors duration-200`}
          >
            12 Months
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse h-64 bg-blueGray-100 rounded"></div>
      ) : transactions && transactions.length > 0 ? (
        <div className="relative h-350-px w-full overflow-hidden px-4">
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  left: 10,
                  right: 30,
                  top: 10,
                  bottom: 20
                }
              },
              scales: {
                y: {
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                  beginAtZero: true,
                  ticks: {
                    color: '#8898aa',
                    font: {
                      family: "'Open Sans', sans-serif",
                      size: 11
                    },
                    callback: function(value) {
                      return '$' + value;
                    },
                    maxTicksLimit: 5
                  },
                  position: 'left'
                },
                x: {
                  grid: {
                    display: false
                  },
                  ticks: {
                    color: '#8898aa',
                    font: {
                      family: "'Open Sans', sans-serif",
                      size: 10
                    },
                    maxRotation: 45,
                    minRotation: 45,
                    autoSkip: true,
                    autoSkipPadding: 15
                  },
                  offset: true
                }
              },
              plugins: {
                legend: {
                  position: 'top',
                  align: 'end',
                  labels: {
                    boxWidth: 12,
                    padding: 20,
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
                      const label = context.dataset.label || '';
                      const value = context.raw as number;
                      return `${label}: $${value.toFixed(2)}`;
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
          <p className="text-sm text-blueGray-600">No transaction data available</p>
        </div>
      )}
    </>
  );
}
