import { Transaction, CreateTransactionDTO, UpdateTransactionDTO, TransactionType } from '../../entities/Transaction';

export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByUserId(userId: string): Promise<Transaction[]>;
  findByUserIdAndType(userId: string, type: TransactionType): Promise<Transaction[]>;
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]>;
  create(transaction: CreateTransactionDTO): Promise<Transaction>;
  update(id: string, transaction: UpdateTransactionDTO): Promise<Transaction | null>;
  delete(id: string): Promise<boolean>;
}
