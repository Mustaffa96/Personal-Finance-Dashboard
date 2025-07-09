import { CreateBudgetDTO, UpdateBudgetDTO, BudgetResponseDTO } from '../../entities/Budget';
import { CategoryType } from '../../entities/Category';

export interface BudgetRepository {
  findById(id: string): Promise<BudgetResponseDTO | null>;
  findByUserId(userId: string): Promise<BudgetResponseDTO[]>;
  findByUserIdAndCategory(userId: string, category: CategoryType): Promise<BudgetResponseDTO | null>;
  findActive(userId: string, date: Date): Promise<BudgetResponseDTO[]>;
  create(budget: CreateBudgetDTO): Promise<BudgetResponseDTO>;
  update(id: string, budget: UpdateBudgetDTO): Promise<BudgetResponseDTO>;
  delete(id: string): Promise<boolean>;
}
