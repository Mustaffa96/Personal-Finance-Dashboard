import { CategoryResponseDTO, CreateCategoryDTO, UpdateCategoryDTO, CategoryType } from '../../entities/Category';

export interface CategoryRepository {
  findAll(): Promise<CategoryResponseDTO[]>;
  findById(id: string): Promise<CategoryResponseDTO | null>;
  findByType(type: CategoryType): Promise<CategoryResponseDTO[]>;
  create(data: CreateCategoryDTO): Promise<CategoryResponseDTO>;
  update(id: string, data: UpdateCategoryDTO): Promise<CategoryResponseDTO>;
  delete(id: string): Promise<boolean>;
}
