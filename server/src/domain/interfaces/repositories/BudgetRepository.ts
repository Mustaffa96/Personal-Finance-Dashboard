import { Budget, CreateBudgetDTO, UpdateBudgetDTO } from '../../entities/Budget';

export interface BudgetRepository {
  findById(id: string): Promise<Budget | null>;
  findByUserId(userId: string): Promise<Budget[]>;
  findByUserIdAndCategoryId(userId: string, categoryId: string): Promise<Budget | null>;
  findActive(userId: string, date: Date): Promise<Budget[]>;
  create(budget: CreateBudgetDTO): Promise<Budget>;
  update(id: string, budget: UpdateBudgetDTO): Promise<Budget | null>;
  delete(id: string): Promise<boolean>;
}
