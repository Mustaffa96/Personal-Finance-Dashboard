'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ExpenseChart from '@/components/dashboard/ExpenseChart';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const [reportType, setReportType] = useState('expense');
  const [timeRange, setTimeRange] = useState('month');
  
  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Sample financial metrics
  const metrics = {
    totalIncome: 3500,
    totalExpenses: 2260,
    netSavings: 1240,
    savingsRate: 35.4,
    largestExpense: {
      category: 'Housing',
      amount: 1200
    },
    fastestGrowing: {
      category: 'Entertainment',
      percentage: 18.5
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
        <p className="text-gray-600">Analyze your financial data and trends</p>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-primary-500">📊</span> Report Controls
          </h2>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded-full text-sm ${
                timeRange === 'month' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setTimeRange('quarter')}
              className={`px-3 py-1 rounded-full text-sm ${
                timeRange === 'quarter' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Quarterly
            </button>
            <button 
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 rounded-full text-sm ${
                timeRange === 'year' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="reportType" className="block text-sm font-medium mb-1">Report Type</label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="expense">Expense Breakdown</option>
              <option value="income">Income Sources</option>
              <option value="cashflow">Cash Flow</option>
              <option value="networth">Net Worth</option>
              <option value="budget">Budget vs Actual</option>
              <option value="savings">Savings Rate</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium mb-1">Date Range</label>
            <div className="flex gap-2">
              <input
                type="month"
                id="dateRange"
                className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                defaultValue="2025-07"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors shadow-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Report
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2 text-primary-500">💹</span> Financial Summary
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Total Income</p>
            <p className="text-xl font-bold text-gray-800">${metrics.totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
            <p className="text-xl font-bold text-red-600">${metrics.totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Net Savings</p>
            <p className="text-xl font-bold text-green-600">${metrics.netSavings.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Savings Rate</p>
            <p className="text-xl font-bold text-blue-600">{metrics.savingsRate}%</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">Key Insights</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Largest expense category: <strong>{metrics.largestExpense.category}</strong> (${metrics.largestExpense.amount})</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Fastest growing category: <strong>{metrics.fastestGrowing.category}</strong> (+{metrics.fastestGrowing.percentage}%)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Your savings rate is <strong>{metrics.savingsRate}%</strong>, which is above the recommended 20%</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>You've reduced spending in <strong>Dining</strong> by 12% compared to last month</span>
              </li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">Recommendations</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">💡</span>
                <span>Consider increasing your retirement contributions by 2%</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">💡</span>
                <span>Review your subscription services to identify potential savings</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">💡</span>
                <span>Set up automatic transfers to your emergency fund</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">💡</span>
                <span>Consider refinancing your loans to take advantage of lower interest rates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2 text-primary-500">📊</span> Expense Breakdown
          </h2>
          <div className="h-80">
            <ExpenseChart />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2 text-primary-500">📈</span> Income vs Expenses
          </h2>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-600 mb-4">
                Income vs Expenses chart will be displayed here
              </p>
              <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors">
                Generate Chart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-6 flex justify-end">
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export PDF
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Report
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
