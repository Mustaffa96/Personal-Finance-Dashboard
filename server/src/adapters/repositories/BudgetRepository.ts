import { ObjectId } from 'mongodb';
import { Budget, CreateBudgetDTO, UpdateBudgetDTO } from '../../domain/entities/Budget';
import { BudgetRepository } from '../../domain/interfaces/repositories/BudgetRepository';
import { collections } from '../../infrastructure/database/mongodb';

export class MongoBudgetRepository implements BudgetRepository {
  async findById(id: string): Promise<Budget | null> {
    if (!collections.budgets) {
      throw new Error('Budgets collection not initialized');
    }

    try {
      const budget = await collections.budgets.findOne({ _id: new ObjectId(id) });
      if (!budget) return null;

      return {
        ...budget,
        id: budget._id.toString(),
        startDate: new Date(budget.startDate),
        endDate: new Date(budget.endDate),
      } as Budget;
    } catch (error) {
      // Log error to a logging service or throw a custom error
      throw new Error(`Failed to find budget by ID: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async findByUserId(userId: string): Promise<Budget[]> {
    if (!collections.budgets) {
      throw new Error('Budgets collection not initialized');
    }

    try {
      const budgets = await collections.budgets.find({ userId }).toArray();
      
      return budgets.map(budget => ({
        ...budget,
        id: budget._id.toString(),
        startDate: new Date(budget.startDate),
        endDate: new Date(budget.endDate),
      })) as Budget[];
    } catch (error) {
      // Log error to a logging service or throw a custom error
      throw new Error(`Failed to find budgets by user ID: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async findByUserIdAndCategoryId(userId: string, categoryId: string): Promise<Budget | null> {
    if (!collections.budgets) {
      throw new Error('Budgets collection not initialized');
    }

    try {
      const budget = await collections.budgets.findOne({ userId, categoryId });
      if (!budget) return null;

      return {
        ...budget,
        id: budget._id.toString(),
        startDate: new Date(budget.startDate),
        endDate: new Date(budget.endDate),
      } as Budget;
    } catch (error) {
      // Log error to a logging service or throw a custom error
      throw new Error(`Failed to find budget by user ID and categoryId: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async findActive(userId: string, date: Date): Promise<Budget[]> {
    if (!collections.budgets) {
      throw new Error('Budgets collection not initialized');
    }

    try {
      const budgets = await collections.budgets.find({
        userId,
        startDate: { $lte: date },
        endDate: { $gte: date },
      }).toArray();
      
      return budgets.map(budget => ({
        ...budget,
        id: budget._id.toString(),
        startDate: new Date(budget.startDate),
        endDate: new Date(budget.endDate),
      })) as Budget[];
    } catch (error) {
      // Log error to a logging service or throw a custom error
      throw new Error(`Failed to find active budgets: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async create(budgetData: CreateBudgetDTO): Promise<Budget> {
    if (!collections.budgets) {
      throw new Error('Budgets collection not initialized');
    }

    try {
      const now = new Date();
      const newBudget = {
        ...budgetData,
        createdAt: now,
        updatedAt: now,
      };

      // Use proper typing instead of 'any'
      const result = await collections.budgets.insertOne(newBudget);
      
      return {
        ...newBudget,
        id: result.insertedId.toString(),
      } as Budget;
    } catch (error) {
      throw new Error(`Failed to create budget: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async update(id: string, budgetData: UpdateBudgetDTO): Promise<Budget | null> {
    if (!collections.budgets) {
      throw new Error('Budgets collection not initialized');
    }

    try {
      const updateData = { ...budgetData, updatedAt: new Date() };
      
      const result = await collections.budgets.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) return null;

      return {
        ...result,
        id: result._id.toString(),
        startDate: new Date(result.startDate),
        endDate: new Date(result.endDate),
      } as Budget;
    } catch (error) {
      // Log error to a logging service or throw a custom error
      throw new Error(`Failed to update budget: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!collections.budgets) {
      throw new Error('Budgets collection not initialized');
    }

    try {
      const result = await collections.budgets.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      // Log error to a logging service or throw a custom error
      throw new Error(`Failed to delete budget: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
