'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import BudgetProgress from '@/components/dashboard/BudgetProgress';

export default function BudgetsPage() {
  const { data: session, status } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeView, setActiveView] = useState('monthly');
  
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

  // Sample budget summary data
  const budgetSummary = {
    totalBudget: 3000,
    spent: 1850,
    remaining: 1150,
    percentUsed: 62
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Budgets</h1>
        <p className="text-gray-600">Manage your spending limits and track your progress</p>
      </div>

      {/* Budget Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-primary-500">💰</span> Budget Summary
          </h2>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveView('monthly')}
              className={`px-3 py-1 rounded-full text-sm ${
                activeView === 'monthly' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setActiveView('yearly')}
              className={`px-3 py-1 rounded-full text-sm ${
                activeView === 'yearly' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Total Budget</p>
            <p className="text-2xl font-bold text-gray-800">${budgetSummary.totalBudget.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Spent So Far</p>
            <p className="text-2xl font-bold text-red-600">${budgetSummary.spent.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Remaining</p>
            <p className="text-2xl font-bold text-green-600">${budgetSummary.remaining.toLocaleString()}</p>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Monthly Progress</span>
            <span>{budgetSummary.percentUsed}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                budgetSummary.percentUsed > 90 ? 'bg-red-600' : 
                budgetSummary.percentUsed > 75 ? 'bg-yellow-500' : 'bg-green-600'
              }`}
              style={{ width: `${budgetSummary.percentUsed}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            <span className="mr-2 text-primary-500">📊</span> Budget Categories
          </h2>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Budget
          </button>
        </div>

        <BudgetProgress showAll />
      </div>

      {/* Add Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Budget</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                <select
                  id="category"
                  className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="food">Food & Dining</option>
                  <option value="transportation">Transportation</option>
                  <option value="housing">Housing</option>
                  <option value="utilities">Utilities</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="shopping">Shopping</option>
                  <option value="personal">Personal Care</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">Budget Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    placeholder="0.00"
                    className="pl-8 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="period" className="block text-sm font-medium mb-1">Budget Period</label>
                <select
                  id="period"
                  className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes (Optional)</label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Add any additional details..."
                  className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Create Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
