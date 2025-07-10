import { CreateBudgetDTO, UpdateBudgetDTO, BudgetResponseDTO } from '../../entities/Budget';


export interface BudgetRepository {
  findById(id: string): Promise<BudgetResponseDTO | null>;
  findByUserId(userId: string): Promise<BudgetResponseDTO[]>;
  findByUserIdAndCategory(userId: string, categoryId: string): Promise<BudgetResponseDTO | null>;
  findActive(userId: string, date: Date): Promise<BudgetResponseDTO[]>;
  create(budget: CreateBudgetDTO): Promise<BudgetResponseDTO>;
  update(id: string, budget: UpdateBudgetDTO): Promise<BudgetResponseDTO>;
  delete(id: string): Promise<boolean>;
}
