import { z } from 'zod';

// Category type enum
export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

// Zod schema for validation
export const CategorySchema = z.object({
  // Support both id and _id formats from MongoDB
  id: z.string().optional(), // Client-side id
  _id: z.union([z.string(), z.object({}).passthrough()]).optional(), // Server-side MongoDB _id (can be string or ObjectId)
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  type: z.nativeEnum(CategoryType),
  icon: z.string().optional(),
  color: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]).optional(), // Support both Date and string formats
  updatedAt: z.union([z.date(), z.string()]).optional(), // Support both Date and string formats
});

// Category entity type
export type Category = z.infer<typeof CategorySchema>;

// Category creation DTO
export type CreateCategoryDTO = Omit<Category, 'id' | '_id' | 'createdAt' | 'updatedAt'>;

// Category update DTO
export type UpdateCategoryDTO = Partial<Omit<Category, 'id' | '_id' | 'createdAt' | 'updatedAt'>>;

// Category response DTO
export type CategoryResponseDTO = Category;
