import { apiClient } from '../../infrastructure/api/apiClient';
import { BudgetRepository } from '../../domain/interfaces/repositories/BudgetRepository';
import { CreateBudgetDTO, UpdateBudgetDTO, BudgetResponseDTO } from '../../domain/entities/Budget';

export class ApiBudgetRepository implements BudgetRepository {
  private readonly baseUrl = '/budgets';

  async findById(id: string): Promise<BudgetResponseDTO | null> {
    try {
      return await apiClient<BudgetResponseDTO>(`${this.baseUrl}/${id}`, {
        method: 'GET',
      });
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findByUserId(): Promise<BudgetResponseDTO[]> {
    return await apiClient<BudgetResponseDTO[]>(`${this.baseUrl}`, {
      method: 'GET',
    });
  }

  async findByUserIdAndCategory(categoryId: string): Promise<BudgetResponseDTO | null> {
    try {
      return await apiClient<BudgetResponseDTO>(`${this.baseUrl}?categoryId=${categoryId}`, {
        method: 'GET',
      });
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findActive(userId: string, date: Date): Promise<BudgetResponseDTO[]> {
    const formattedDate = date.toISOString();
    return await apiClient<BudgetResponseDTO[]>(
      `${this.baseUrl}?active=true&userId=${userId}&date=${formattedDate}`,
      { method: 'GET' }
    );
  }

  async create(budget: CreateBudgetDTO): Promise<BudgetResponseDTO> {
    return await apiClient<BudgetResponseDTO>(this.baseUrl, {
      method: 'POST',
      body: budget,
    });
  }

  async update(id: string, budget: UpdateBudgetDTO): Promise<BudgetResponseDTO> {
    return await apiClient<BudgetResponseDTO>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: budget,
    });
  }

  async delete(id: string): Promise<boolean> {
    await apiClient<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    return true;
  }
}
