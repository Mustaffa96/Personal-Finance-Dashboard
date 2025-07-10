import { z } from 'zod';

// Transaction type enum
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

// Zod schema for validation
export const TransactionSchema = z.object({
  id: z.string().optional(), // Client-side id
  _id: z.union([z.string(), z.object({}).passthrough()]).optional(), // Server-side MongoDB _id
  userId: z.string(),
  type: z.nativeEnum(TransactionType),
  categoryId: z.string().optional(), // Category ID from the Category entity
  category: z.string().optional(), // For backward compatibility with API responses that use 'category' instead of 'categoryId'
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
  date: z.union([z.date(), z.string()]).transform(val => 
    typeof val === 'string' ? new Date(val) : val
  ), // Support both Date and string formats
  notes: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]).optional()
    .transform(val => val ? (typeof val === 'string' ? new Date(val) : val) : undefined),
  updatedAt: z.union([z.date(), z.string()]).optional()
    .transform(val => val ? (typeof val === 'string' ? new Date(val) : val) : undefined),
});

// Transaction entity type
export type Transaction = z.infer<typeof TransactionSchema>;

// Transaction creation DTO
export type CreateTransactionDTO = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;

// Transaction update DTO
export type UpdateTransactionDTO = Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;

// Transaction response DTO
export type TransactionResponseDTO = Transaction;
