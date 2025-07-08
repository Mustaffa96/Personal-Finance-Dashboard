'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function GoalsPage() {
  const { data: session, status } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
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

  // Sample financial goals data
  const goals = [
    {
      id: 1,
      name: 'Emergency Fund',
      target: 10000,
      current: 6500,
      deadline: '2025-12-31',
      category: 'savings',
      progress: 65,
      icon: '🛡️'
    },
    {
      id: 2,
      name: 'New Car',
      target: 25000,
      current: 8750,
      deadline: '2026-06-30',
      category: 'purchase',
      progress: 35,
      icon: '🚗'
    },
    {
      id: 3,
      name: 'Vacation',
      target: 5000,
      current: 4200,
      deadline: '2025-08-15',
      category: 'travel',
      progress: 84,
      icon: '✈️'
    },
    {
      id: 4,
      name: 'Home Down Payment',
      target: 60000,
      current: 15000,
      deadline: '2027-01-01',
      category: 'purchase',
      progress: 25,
      icon: '🏠'
    },
    {
      id: 5,
      name: 'Retirement Fund',
      target: 500000,
      current: 125000,
      deadline: '2045-01-01',
      category: 'retirement',
      progress: 25,
      icon: '👵'
    }
  ];

  // Filter goals based on active filter
  const filteredGoals = activeFilter === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === activeFilter);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Financial Goals</h1>
        <p className="text-gray-600">Track your progress towards your financial targets</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                activeFilter === 'all' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Goals
            </button>
            <button 
              onClick={() => setActiveFilter('savings')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                activeFilter === 'savings' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Savings
            </button>
            <button 
              onClick={() => setActiveFilter('purchase')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                activeFilter === 'purchase' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Purchases
            </button>
            <button 
              onClick={() => setActiveFilter('travel')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                activeFilter === 'travel' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Travel
            </button>
            <button 
              onClick={() => setActiveFilter('retirement')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                activeFilter === 'retirement' 
                  ? 'bg-amber-100 text-amber-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Retirement
            </button>
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm flex items-center whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Goal
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map(goal => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{goal.icon}</span>
                  <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      goal.category === 'savings' ? 'bg-blue-600' :
                      goal.category === 'purchase' ? 'bg-purple-600' :
                      goal.category === 'travel' ? 'bg-green-600' :
                      'bg-amber-600'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Current</p>
                  <p className="font-semibold">${goal.current.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Target</p>
                  <p className="font-semibold">${goal.target.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-gray-500">Deadline:</span>
                  <span className="ml-1">{new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
                <button className="text-primary-600 hover:text-primary-800 font-medium">
                  Update
                </button>
              </div>
            </div>
          ))}
          
          {/* Add Goal Card */}
          <div 
            onClick={() => setShowAddModal(true)}
            className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] text-gray-500 hover:bg-gray-50 hover:text-primary-600 cursor-pointer transition-colors"
          >
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="font-medium">Add New Goal</p>
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Goal</h2>
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
                <label htmlFor="goalName" className="block text-sm font-medium mb-1">Goal Name</label>
                <input
                  type="text"
                  id="goalName"
                  placeholder="e.g., Emergency Fund"
                  className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="goalCategory" className="block text-sm font-medium mb-1">Category</label>
                <select
                  id="goalCategory"
                  className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="savings">Savings</option>
                  <option value="purchase">Purchase</option>
                  <option value="travel">Travel</option>
                  <option value="retirement">Retirement</option>
                  <option value="debt">Debt Repayment</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="targetAmount" className="block text-sm font-medium mb-1">Target Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="targetAmount"
                      placeholder="0.00"
                      className="pl-8 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="currentAmount" className="block text-sm font-medium mb-1">Current Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="currentAmount"
                      placeholder="0.00"
                      className="pl-8 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium mb-1">Target Date</label>
                <input
                  type="date"
                  id="deadline"
                  className="p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="icon" className="block text-sm font-medium mb-1">Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {['💰', '🏠', '🚗', '✈️', '👨‍🎓', '🛡️', '💳', '👵'].map(icon => (
                    <button
                      key={icon}
                      type="button"
                      className="h-10 w-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {icon}
                    </button>
                  ))}
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
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
