import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { User, CreateUserDTO, UpdateUserDTO } from '../../domain/entities/User';
import { UserRepository } from '../../domain/interfaces/repositories/UserRepository';
import { collections } from '../../infrastructure/database/mongodb';

export class MongoUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    if (!collections.users) {
      throw new Error('Users collection not initialized');
    }

    try {
      const user = await collections.users.findOne({ _id: new ObjectId(id) });
      if (!user) return null;

      return {
        ...user,
        id: user._id.toString(),
      } as User;
    } catch (error) {
      // Error finding user by ID
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!collections.users) {
      throw new Error('Users collection not initialized');
    }

    try {
      const user = await collections.users.findOne({ email });
      if (!user) return null;

      return {
        ...user,
        id: user._id.toString(),
      } as User;
    } catch (error) {
      // Error finding user by email
      return null;
    }
  }

  async create(userData: CreateUserDTO): Promise<User> {
    if (!collections.users) {
      throw new Error('Users collection not initialized');
    }

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password!, 10);

      const now = new Date();
      const newUser = {
        ...userData,
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      };

      // Define proper type for MongoDB document
      type UserDocument = Omit<User, 'id'> & { _id?: ObjectId };
      const result = await collections.users.insertOne(newUser as UserDocument);
      
      return {
        ...newUser,
        id: result.insertedId.toString(),
      } as User;
    } catch (error) {
      // Rethrow with more context
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async update(id: string, userData: UpdateUserDTO): Promise<User | null> {
    if (!collections.users) {
      throw new Error('Users collection not initialized');
    }

    try {
      // Define proper type for update data
      type UpdateData = Partial<Omit<User, 'id'>> & { updatedAt: Date };
      const updateData: UpdateData = { ...userData, updatedAt: new Date() };
      
      // Hash password if provided
      if (userData.password) {
        updateData.password = await bcrypt.hash(userData.password, 10);
      }

      const result = await collections.users.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) return null;

      return {
        ...result,
        id: result._id.toString(),
      } as User;
    } catch (error) {
      // Error updating user
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!collections.users) {
      throw new Error('Users collection not initialized');
    }

    try {
      const result = await collections.users.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      // Error deleting user
      return false;
    }
  }
}
