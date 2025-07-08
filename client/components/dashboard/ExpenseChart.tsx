'use client';

import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseData {
  category: string;
  amount: number;
  color: string;
}

export default function ExpenseChart() {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    const mockExpenseData: ExpenseData[] = [
      { category: 'Housing', amount: 1200, color: 'rgba(255, 99, 132, 0.8)' },
      { category: 'Food', amount: 450, color: 'rgba(54, 162, 235, 0.8)' },
      { category: 'Transportation', amount: 200, color: 'rgba(255, 206, 86, 0.8)' },
      { category: 'Utilities', amount: 150, color: 'rgba(75, 192, 192, 0.8)' },
      { category: 'Entertainment', amount: 120, color: 'rgba(153, 102, 255, 0.8)' },
      { category: 'Other', amount: 140, color: 'rgba(255, 159, 64, 0.8)' },
    ];

    const data = {
      labels: mockExpenseData.map(item => item.category),
      datasets: [
        {
          data: mockExpenseData.map(item => item.amount),
          backgroundColor: mockExpenseData.map(item => item.color),
          borderColor: mockExpenseData.map(item => item.color.replace('0.8', '1')),
          borderWidth: 1,
        },
      ],
    };

    setTimeout(() => {
      setChartData(data);
      setLoading(false);
    }, 500);
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="relative h-64">
      {chartData && <Doughnut data={chartData} options={options} />}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-500">Total Expenses</p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">$2,260</p>
        </div>
      </div>
    </div>
  );
}
