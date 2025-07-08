'use client';

import { useState, useEffect } from 'react';
import { TransactionAPI } from '../services/api';

// Common transaction categories
const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Housing',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Personal Care',
  'Education',
  'Travel',
  'Debt Payment',
  'Savings',
  'Investments',
  'Gifts & Donations',
  'Other',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Rental Income',
  'Gifts',
  'Refunds',
  'Other',
];

interface TransactionFormProps {
  transaction?: {
    _id?: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TransactionForm({
  transaction,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const isEditing = !!transaction?._id;
  
  // Form state
  const [formData, setFormData] = useState({
    amount: transaction?.amount || 0,
    type: transaction?.type || 'expense',
    category: transaction?.category || '',
    description: transaction?.description || '',
    date: transaction?.date 
      ? new Date(transaction.date).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>(EXPENSE_CATEGORIES);
  
  // Update categories based on transaction type
  useEffect(() => {
    setCategories(formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES);
    // Reset category when switching types if the current category isn't in the new list
    const categoryList = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!categoryList.includes(formData.category)) {
      setFormData(prev => ({ ...prev, category: '' }));
    }
  }, [formData.type]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      // Ensure amount is a positive number
      const amount = parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: isNaN(amount) ? 0 : Math.abs(amount) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isEditing && transaction?._id) {
        // Update existing transaction
        await TransactionAPI.update(transaction._id, {
          ...formData,
          amount: Number(formData.amount),
          date: new Date(formData.date),
        });
      } else {
        // Create new transaction
        await TransactionAPI.create({
          ...formData,
          amount: Number(formData.amount),
          date: new Date(formData.date),
        });
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">
        {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transaction Type */}
        <div className="space-y-1">
          <label htmlFor="type" className="block text-sm font-medium">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        
        {/* Amount */}
        <div className="space-y-1">
          <label htmlFor="amount" className="block text-sm font-medium">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2">$</span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-2 pl-7 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
        </div>
      </div>
      
      {/* Category */}
      <div className="space-y-1">
        <label htmlFor="category" className="block text-sm font-medium">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      
      {/* Description */}
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>
      
      {/* Date */}
      <div className="space-y-1">
        <label htmlFor="date" className="block text-sm font-medium">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        />
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={loading}
        >
          {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
