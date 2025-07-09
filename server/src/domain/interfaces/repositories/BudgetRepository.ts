import { Budget, CreateBudgetDTO, UpdateBudgetDTO } from '../../entities/Budget';
import { TransactionCategory } from '../../entities/Transaction';

export interface BudgetRepository {
  findById(id: string): Promise<Budget | null>;
  findByUserId(userId: string): Promise<Budget[]>;
  findByUserIdAndCategory(userId: string, category: TransactionCategory): Promise<Budget | null>;
  findActive(userId: string, date: Date): Promise<Budget[]>;
  create(budget: CreateBudgetDTO): Promise<Budget>;
  update(id: string, budget: UpdateBudgetDTO): Promise<Budget | null>;
  delete(id: string): Promise<boolean>;
}
