import { apiClient } from '../../infrastructure/api/apiClient';
import { UserRepository } from '../../domain/interfaces/repositories/UserRepository';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../../domain/entities/User';

export class ApiUserRepository implements UserRepository {
  private readonly baseUrl = '/users';

  async findById(id: string): Promise<UserResponseDTO | null> {
    try {
      return await apiClient<UserResponseDTO>(`${this.baseUrl}/${id}`, {
        method: 'GET',
      });
    } catch (error) {
      if ((error as { status?: number }).status === 404) {
        return null;
      }
      throw error;
    }
  }

  async findByEmail(): Promise<UserResponseDTO | null> {
    try {
      // Note: Our server doesn't have a direct endpoint for finding by email
      // This would typically be handled by the auth/me endpoint after login
      // This is a placeholder that would need to be implemented on the server
      return null;
    } catch (error) {
      return null;
    }
  }

  async create(user: CreateUserDTO): Promise<UserResponseDTO> {
    // User creation is handled by the auth/register endpoint
    return await apiClient<{ user: UserResponseDTO }>('/auth/register', {
      method: 'POST',
      body: user,
      requiresAuth: false, // Registration doesn't require auth
    }).then(response => response.user);
  }

  async update(id: string, user: UpdateUserDTO): Promise<UserResponseDTO> {
    return await apiClient<UserResponseDTO>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: user,
    });
  }

  async delete(id: string): Promise<boolean> {
    await apiClient<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    return true;
  }
}
