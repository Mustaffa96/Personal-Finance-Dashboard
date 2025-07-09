import { z } from 'zod';
import { TransactionCategory } from './Transaction';

// Budget period enum
export enum BudgetPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

// Zod schema for validation
export const BudgetSchema = z.object({
  id: z.string().optional(), // MongoDB generates _id
  userId: z.string(),
  category: z.nativeEnum(TransactionCategory),
  amount: z.number().positive('Amount must be positive'),
  period: z.nativeEnum(BudgetPeriod),
  startDate: z.date(),
  endDate: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Budget entity type
export type Budget = z.infer<typeof BudgetSchema>;

// Budget creation DTO
export type CreateBudgetDTO = Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>;

// Budget update DTO
export type UpdateBudgetDTO = Partial<Omit<Budget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;

// Budget response DTO
export type BudgetResponseDTO = Budget;
