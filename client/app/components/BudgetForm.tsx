'use client';

import { useState, useEffect } from 'react';
import { BudgetAPI } from '../services/api';

// Common budget categories (same as expense categories for consistency)
const BUDGET_CATEGORIES = [
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

interface BudgetFormProps {
  budget?: {
    _id?: string;
    category: string;
    amount: number;
    period: 'monthly' | 'yearly';
    description?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BudgetForm({
  budget,
  onSuccess,
  onCancel,
}: BudgetFormProps) {
  const isEditing = !!budget?._id;
  
  // Form state
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    amount: budget?.amount || 0,
    period: budget?.period || 'monthly',
    description: budget?.description || '',
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
      if (isEditing && budget?._id) {
        // Update existing budget
        await BudgetAPI.update(budget._id, {
          ...formData,
          amount: Number(formData.amount),
        });
      } else {
        // Create new budget
        await BudgetAPI.create({
          ...formData,
          amount: Number(formData.amount),
        });
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">
        {isEditing ? 'Edit Budget' : 'Create New Budget'}
      </h2>
      
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {BUDGET_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Amount */}
        <div className="space-y-1">
          <label htmlFor="amount" className="block text-sm font-medium">
            Budget Amount
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
      
      {/* Period */}
      <div className="space-y-1">
        <label htmlFor="period" className="block text-sm font-medium">
          Budget Period
        </label>
        <select
          id="period"
          name="period"
          value={formData.period}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      
      {/* Description */}
      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
