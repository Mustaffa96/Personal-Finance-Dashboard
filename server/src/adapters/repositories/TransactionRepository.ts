import { ObjectId } from 'mongodb';
import { Transaction, CreateTransactionDTO, UpdateTransactionDTO, TransactionType } from '../../domain/entities/Transaction';
import { TransactionRepository } from '../../domain/interfaces/repositories/TransactionRepository';
import { collections } from '../../infrastructure/database/mongodb';
import { logger } from '../../infrastructure/logging/logger';

export class MongoTransactionRepository implements TransactionRepository {
  async findById(id: string): Promise<Transaction | null> {
    if (!collections.transactions) {
      throw new Error('Transactions collection not initialized');
    }

    try {
      const transaction = await collections.transactions.findOne({ _id: new ObjectId(id) });
      if (!transaction) return null;

      return {
        ...transaction,
        id: transaction._id.toString(),
        date: new Date(transaction.date),
      } as Transaction;
    } catch (error) {
      logger.error('Error finding transaction by ID:', error);
      return null;
    }
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    if (!collections.transactions) {
      throw new Error('Transactions collection not initialized');
    }

    try {
      const transactions = await collections.transactions.find({ userId }).toArray();
      
      return transactions.map(transaction => ({
        ...transaction,
        id: transaction._id.toString(),
        date: new Date(transaction.date),
      })) as Transaction[];
    } catch (error) {
      logger.error('Error finding transactions by user ID:', error);
      return [];
    }
  }

  async findByUserIdAndType(userId: string, type: TransactionType): Promise<Transaction[]> {
    if (!collections.transactions) {
      throw new Error('Transactions collection not initialized');
    }

    try {
      const transactions = await collections.transactions.find({ userId, type }).toArray();
      
      return transactions.map(transaction => ({
        ...transaction,
        id: transaction._id.toString(),
        date: new Date(transaction.date),
      })) as Transaction[];
    } catch (error) {
      logger.error('Error finding transactions by user ID and type:', error);
      return [];
    }
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    if (!collections.transactions) {
      throw new Error('Transactions collection not initialized');
    }

    try {
      const transactions = await collections.transactions.find({
        userId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }).toArray();
      
      return transactions.map(transaction => ({
        ...transaction,
        id: transaction._id.toString(),
        date: new Date(transaction.date),
      })) as Transaction[];
    } catch (error) {
      logger.error('Error finding transactions by date range:', error);
      return [];
    }
  }

  async create(transactionData: CreateTransactionDTO): Promise<Transaction> {
    if (!collections.transactions) {
      throw new Error('Transactions collection not initialized');
    }

    try {
      const now = new Date();
      const newTransaction = {
        ...transactionData,
        createdAt: now,
        updatedAt: now,
      };

      // Convert to a MongoDB compatible document without id field
      const mongoDocument = { ...newTransaction };
      const result = await collections.transactions.insertOne(mongoDocument);
      
      return {
        ...newTransaction,
        id: result.insertedId.toString(),
      } as Transaction;
    } catch (error) {
      logger.error('Error creating transaction:', error);
      throw error;
    }
  }

  async update(id: string, transactionData: UpdateTransactionDTO): Promise<Transaction | null> {
    if (!collections.transactions) {
      throw new Error('Transactions collection not initialized');
    }

    try {
      const updateData = { ...transactionData, updatedAt: new Date() };
      
      const result = await collections.transactions.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) return null;

      return {
        ...result,
        id: result._id.toString(),
        date: new Date(result.date),
      } as Transaction;
    } catch (error) {
      logger.error('Error updating transaction:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!collections.transactions) {
      throw new Error('Transactions collection not initialized');
    }

    try {
      const result = await collections.transactions.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      return false;
    }
  }
}
