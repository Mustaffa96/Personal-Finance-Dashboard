import { CreateTransactionDTO, UpdateTransactionDTO, TransactionResponseDTO, TransactionType } from '../../entities/Transaction';

export interface TransactionRepository {
  findById(id: string): Promise<TransactionResponseDTO | null>;
  findByUserId(userId: string): Promise<TransactionResponseDTO[]>;
  findByUserIdAndType(userId: string, type: TransactionType): Promise<TransactionResponseDTO[]>;
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<TransactionResponseDTO[]>;
  create(transaction: CreateTransactionDTO): Promise<TransactionResponseDTO>;
  update(id: string, transaction: UpdateTransactionDTO): Promise<TransactionResponseDTO>;
  delete(id: string): Promise<boolean>;
}
