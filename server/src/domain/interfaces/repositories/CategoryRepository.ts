import { Category, CreateCategoryDTO, UpdateCategoryDTO, CategoryType } from '../../entities/Category';

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findByType(type: CategoryType): Promise<Category[]>;
  create(data: CreateCategoryDTO): Promise<Category>;
  update(id: string, data: UpdateCategoryDTO): Promise<Category | null>;
  delete(id: string): Promise<boolean>;
}
