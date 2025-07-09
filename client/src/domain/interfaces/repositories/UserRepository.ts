import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from '../../entities/User';

export interface UserRepository {
  findById(id: string): Promise<UserResponseDTO | null>;
  findByEmail(email: string): Promise<UserResponseDTO | null>;
  create(user: CreateUserDTO): Promise<UserResponseDTO>;
  update(id: string, user: UpdateUserDTO): Promise<UserResponseDTO>;
  delete(id: string): Promise<boolean>;
}
