/**
 * API Service for Personal Finance Dashboard
 * Handles all API requests to the backend server
 */

// Base API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Generic fetch wrapper with authentication and error handling
 */
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Make the request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for auth
  });

  // Parse the JSON response
  const data = await response.json();

  // Check if the request was successful
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

/**
 * Transaction API methods
 */
export const TransactionAPI = {
  // Get all transactions with optional filters
  getAll: async (filters?: {
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchWithAuth(`/transactions${query}`);
  },

  // Get a single transaction by ID
  getById: async (id: string) => {
    return fetchWithAuth(`/transactions/${id}`);
  },

  // Create a new transaction
  create: async (transaction: {
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date?: Date;
  }) => {
    return fetchWithAuth('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  },

  // Update an existing transaction
  update: async (
    id: string,
    updates: {
      amount?: number;
      type?: 'income' | 'expense';
      category?: string;
      description?: string;
      date?: Date;
    }
  ) => {
    return fetchWithAuth(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete a transaction
  delete: async (id: string) => {
    return fetchWithAuth(`/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  // Get transaction summary for dashboard
  getSummary: async (period: 'week' | 'month' | 'year' = 'month') => {
    return fetchWithAuth(`/transactions/summary?period=${period}`);
  },
};

/**
 * Budget API methods
 */
export const BudgetAPI = {
  // Get all budgets
  getAll: async () => {
    return fetchWithAuth('/budgets');
  },

  // Get a single budget by ID
  getById: async (id: string) => {
    return fetchWithAuth(`/budgets/${id}`);
  },

  // Create a new budget
  create: async (budget: {
    category: string;
    amount: number;
    period: 'monthly' | 'yearly';
    description?: string;
  }) => {
    return fetchWithAuth('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
  },

  // Update an existing budget
  update: async (
    id: string,
    updates: {
      category?: string;
      amount?: number;
      period?: 'monthly' | 'yearly';
      description?: string;
    }
  ) => {
    return fetchWithAuth(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Delete a budget
  delete: async (id: string) => {
    return fetchWithAuth(`/budgets/${id}`, {
      method: 'DELETE',
    });
  },

  // Get budget progress
  getProgress: async () => {
    return fetchWithAuth('/budgets/progress');
  },
};

/**
 * User API methods
 */
export const UserAPI = {
  // Get user profile
  getProfile: async () => {
    return fetchWithAuth('/users/profile');
  },

  // Update user profile
  updateProfile: async (updates: { name?: string; email?: string }) => {
    return fetchWithAuth('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Change user password
  changePassword: async (passwords: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return fetchWithAuth('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  },

  // Delete user account
  deleteAccount: async () => {
    return fetchWithAuth('/users', {
      method: 'DELETE',
    });
  },
};
