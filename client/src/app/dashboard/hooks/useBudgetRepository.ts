'use client';

import { ApiBudgetRepository } from '../../../adapters/repositories/BudgetRepository';
import { BudgetRepository } from '../../../domain/interfaces/repositories/BudgetRepository';

export function useBudgetRepository(): BudgetRepository {
  return new ApiBudgetRepository();
}
