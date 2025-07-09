import { z } from 'zod';

// Category type enum
export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

// Zod schema for validation
export const CategorySchema = z.object({
  id: z.string().optional(), // MongoDB generates _id
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  type: z.nativeEnum(CategoryType),
  icon: z.string().optional(),
  color: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Category entity type
export type Category = z.infer<typeof CategorySchema>;

// Category creation DTO
export type CreateCategoryDTO = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;

// Category update DTO
export type UpdateCategoryDTO = Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>;

// Category response DTO
export type CategoryResponseDTO = Category;
