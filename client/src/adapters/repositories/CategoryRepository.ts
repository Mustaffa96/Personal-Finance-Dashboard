import { apiClient } from '../../infrastructure/api/apiClient';
import { CategoryRepository } from '../../domain/interfaces/repositories/CategoryRepository';
import { 
  CreateCategoryDTO, 
  UpdateCategoryDTO, 
  CategoryResponseDTO, 
  CategoryType 
} from '../../domain/entities/Category';

export class ApiCategoryRepository implements CategoryRepository {
  private readonly baseUrl = '/categories';

  async findAll(): Promise<CategoryResponseDTO[]> {
    return await apiClient<CategoryResponseDTO[]>(this.baseUrl, {
      method: 'GET',
    });
  }

  async findById(id: string): Promise<CategoryResponseDTO | null> {
    try {
      return await apiClient<CategoryResponseDTO>(`${this.baseUrl}/${id}`, {
        method: 'GET',
      });
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findByType(type: CategoryType): Promise<CategoryResponseDTO[]> {
    return await apiClient<CategoryResponseDTO[]>(`${this.baseUrl}?type=${type}`, {
      method: 'GET',
    });
  }

  async create(data: CreateCategoryDTO): Promise<CategoryResponseDTO> {
    return await apiClient<CategoryResponseDTO>(this.baseUrl, {
      method: 'POST',
      body: data,
    });
  }

  async update(id: string, data: UpdateCategoryDTO): Promise<CategoryResponseDTO> {
    return await apiClient<CategoryResponseDTO>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(id: string): Promise<boolean> {
    await apiClient<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    return true;
  }
}
