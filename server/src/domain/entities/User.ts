import { z } from 'zod';

// Zod schema for validation
export const UserSchema = z.object({
  id: z.string().optional(), // MongoDB generates _id
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  allowedOrigins: z.array(z.string().url('Invalid URL format')).optional(),
  role: z.enum(['user', 'admin']).default('user').optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// User entity type
export type User = z.infer<typeof UserSchema>;

// User creation DTO
export type CreateUserDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// User update DTO
export type UpdateUserDTO = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

// User authentication DTO
export type UserAuthDTO = {
  email: string;
  password: string;
};

// User response DTO (excludes sensitive data)
export type UserResponseDTO = Omit<User, 'password'>;
