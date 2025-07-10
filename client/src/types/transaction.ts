export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TransactionCategory {
  HOUSING = 'housing',
  TRANSPORTATION = 'transportation',
  FOOD = 'food',
  UTILITIES = 'utilities',
  HEALTHCARE = 'healthcare',
  ENTERTAINMENT = 'entertainment',
  EDUCATION = 'education',
  PERSONAL = 'personal',
  DEBT = 'debt',
  SAVINGS = 'savings',
  INCOME = 'income',
  OTHER = 'other',
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
