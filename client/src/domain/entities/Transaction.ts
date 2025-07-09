import { z } from 'zod';

// Transaction type enum
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

// Zod schema for validation
export const TransactionSchema = z.object({
  id: z.string().optional(), // MongoDB generates _id
  userId: z.string(),
  type: z.nativeEnum(TransactionType),
  category: z.string(), // Category ID from the Category entity
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
  date: z.date(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Transaction entity type
export type Transaction = z.infer<typeof TransactionSchema>;

// Transaction creation DTO
export type CreateTransactionDTO = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;

// Transaction update DTO
export type UpdateTransactionDTO = Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;

// Transaction response DTO
export type TransactionResponseDTO = Transaction;
