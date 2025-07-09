import { ObjectId } from 'mongodb';
import { Category, CreateCategoryDTO, UpdateCategoryDTO, CategoryType } from '../../domain/entities/Category';
import { CategoryRepository } from '../../domain/interfaces/repositories/CategoryRepository';
import { collections } from '../../infrastructure/database/mongodb';

export class MongoCategoryRepository implements CategoryRepository {
  async findAll(): Promise<Category[]> {
    if (!collections.categories) {
      throw new Error('Categories collection not initialized');
    }

    try {
      const categories = await collections.categories.find().toArray();
      
      return categories.map(category => ({
        ...category,
        id: category._id.toString(),
      })) as Category[];
    } catch (error) {
      // Error handled by returning empty array
      return [];
    }
  }

  async findById(id: string): Promise<Category | null> {
    if (!collections.categories) {
      throw new Error('Categories collection not initialized');
    }

    try {
      const category = await collections.categories.findOne({ _id: new ObjectId(id) });
      if (!category) return null;

      return {
        ...category,
        id: category._id.toString(),
      } as Category;
    } catch (error) {
      // Error handled by returning null
      return null;
    }
  }

  async findByType(type: CategoryType): Promise<Category[]> {
    if (!collections.categories) {
      throw new Error('Categories collection not initialized');
    }

    try {
      const categories = await collections.categories.find({ type }).toArray();
      
      return categories.map(category => ({
        ...category,
        id: category._id.toString(),
      })) as Category[];
    } catch (error) {
      // Error handled by returning empty array
      return [];
    }
  }

  async create(data: CreateCategoryDTO): Promise<Category> {
    if (!collections.categories) {
      throw new Error('Categories collection not initialized');
    }

    const now = new Date();
    const newCategory = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collections.categories.insertOne(newCategory);
    
    return {
      ...newCategory,
      id: result.insertedId.toString(),
    } as Category;
  }

  async update(id: string, data: UpdateCategoryDTO): Promise<Category | null> {
    if (!collections.categories) {
      throw new Error('Categories collection not initialized');
    }

    try {
      const updateData = { ...data, updatedAt: new Date() };
      
      const result = await collections.categories.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) return null;

      return {
        ...result,
        id: result._id.toString(),
      } as Category;
    } catch (error) {
      // Error handled by returning null
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!collections.categories) {
      throw new Error('Categories collection not initialized');
    }

    try {
      const result = await collections.categories.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      // Error handled by returning false
      return false;
    }
  }
}
