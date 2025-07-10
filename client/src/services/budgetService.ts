import { apiClient } from '@/infrastructure/api/apiClient';

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getBudgets(active: boolean = true): Promise<Budget[]> {
  try {
    const endpoint = active ? '/api/budgets?active=true' : '/api/budgets';
    return await apiClient<Budget[]>(endpoint, {
      method: 'GET',
      requiresAuth: true,
    });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return [];
  }
}

export async function getBudgetByCategory(categoryId: string): Promise<Budget | null> {
  try {
    const budgets = await apiClient<Budget[]>(`/api/budgets?categoryId=${categoryId}`, {
      method: 'GET',
      requiresAuth: true,
    });
    
    return budgets && budgets.length > 0 ? budgets[0] : null;
  } catch (error) {
    console.error(`Error fetching budget for categoryId ${categoryId}:`, error);
    return null;
  }
}

export async function getBudgetById(id: string): Promise<Budget | null> {
  try {
    return await apiClient<Budget>(`/api/budgets/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });
  } catch (error) {
    console.error(`Error fetching budget ${id}:`, error);
    return null;
  }
}

export async function createBudget(budget: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Budget | null> {
  try {
    return await apiClient<Budget>('/api/budgets', {
      method: 'POST',
      body: budget,
      requiresAuth: true,
    });
  } catch (error) {
    console.error('Error creating budget:', error);
    return null;
  }
}

export async function updateBudget(id: string, budget: Partial<Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Budget | null> {
  try {
    return await apiClient<Budget>(`/api/budgets/${id}`, {
      method: 'PUT',
      body: budget,
      requiresAuth: true,
    });
  } catch (error) {
    console.error(`Error updating budget ${id}:`, error);
    return null;
  }
}
