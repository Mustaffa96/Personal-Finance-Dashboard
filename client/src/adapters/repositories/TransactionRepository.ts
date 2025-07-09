import { apiClient } from '../../infrastructure/api/apiClient';
import { TransactionRepository } from '../../domain/interfaces/repositories/TransactionRepository';
import { 
  CreateTransactionDTO, 
  UpdateTransactionDTO, 
  TransactionResponseDTO, 
  TransactionType 
} from '../../domain/entities/Transaction';

export class ApiTransactionRepository implements TransactionRepository {
  private readonly baseUrl = '/transactions';

  async findById(id: string): Promise<TransactionResponseDTO | null> {
    try {
      return await apiClient<TransactionResponseDTO>(`${this.baseUrl}/${id}`, {
        method: 'GET',
      });
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<TransactionResponseDTO[]> {
    return await apiClient<TransactionResponseDTO[]>(`${this.baseUrl}?userId=${userId}`, {
      method: 'GET',
    });
  }

  async findByUserIdAndType(userId: string, type: TransactionType): Promise<TransactionResponseDTO[]> {
    return await apiClient<TransactionResponseDTO[]>(`${this.baseUrl}?userId=${userId}&type=${type}`, {
      method: 'GET',
    });
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<TransactionResponseDTO[]> {
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    
    return await apiClient<TransactionResponseDTO[]>(
      `${this.baseUrl}?userId=${userId}&startDate=${start}&endDate=${end}`,
      { method: 'GET' }
    );
  }

  async create(transaction: CreateTransactionDTO): Promise<TransactionResponseDTO> {
    return await apiClient<TransactionResponseDTO>(this.baseUrl, {
      method: 'POST',
      body: transaction,
    });
  }

  async update(id: string, transaction: UpdateTransactionDTO): Promise<TransactionResponseDTO> {
    return await apiClient<TransactionResponseDTO>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: transaction,
    });
  }

  async delete(id: string): Promise<boolean> {
    await apiClient<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    return true;
  }
}
