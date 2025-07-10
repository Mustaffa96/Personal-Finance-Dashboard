import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Budget, 
  getBudgets, 
  createBudget, 
  updateBudget, 
  getBudgetById 
} from '@/services/budgetService';

// Query keys for React Query
export const budgetKeys = {
  all: ['budgets'] as const,
  active: () => [...budgetKeys.all, 'active'] as const,
  inactive: () => [...budgetKeys.all, 'inactive'] as const,
  detail: (id: string) => [...budgetKeys.all, 'detail', id] as const,
};

// Hook to fetch all active budgets
export function useBudgets(active: boolean = true) {
  return useQuery({
    queryKey: active ? budgetKeys.active() : budgetKeys.all,
    queryFn: () => getBudgets(active),
  });
}

// Hook to fetch a specific budget by ID
export function useBudgetById(id: string) {
  return useQuery({
    queryKey: budgetKeys.detail(id),
    queryFn: () => getBudgetById(id),
    enabled: !!id, // Only run the query if an ID is provided
  });
}

// Hook to create a new budget
export function useCreateBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newBudget: Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => 
      createBudget(newBudget),
    onSuccess: () => {
      // Invalidate and refetch active budgets after creating a new one
      queryClient.invalidateQueries({ queryKey: budgetKeys.active() });
    },
  });
}

// Hook to update an existing budget
export function useUpdateBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      id, 
      budget 
    }: { 
      id: string; 
      budget: Partial<Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> 
    }) => updateBudget(id, budget),
    onSuccess: (data, variables) => {
      // Invalidate and refetch the specific budget that was updated
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(variables.id) });
      // Also invalidate the list of budgets
      queryClient.invalidateQueries({ queryKey: budgetKeys.active() });
    },
  });
}
