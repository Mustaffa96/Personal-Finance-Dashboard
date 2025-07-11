/* eslint-disable no-console */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { connectToDatabase, closeDatabase, collections } from '../infrastructure/database/mongodb';
import { TransactionType } from '../domain/entities/Transaction';
import { BudgetPeriod } from '../domain/entities/Budget';
import { CategoryType } from '../domain/entities/Category';

async function seed() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database');

    // Clear existing data
    console.log('Clearing existing data...');
    if (collections.users) await collections.users.deleteMany({});
    if (collections.transactions) await collections.transactions.deleteMany({});
    if (collections.budgets) await collections.budgets.deleteMany({});
    if (collections.categories) await collections.categories.deleteMany({});

    // Create test user
    console.log('Creating test user...');
    const userId = new ObjectId();
    const hashedPassword = await bcrypt.hash('password123', 10);
    const now = new Date();
    
    if (collections.users) {
      await collections.users.insertOne({
        _id: userId,
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Create categories first so we can reference them in transactions
    console.log('Creating categories...');
    const categoryIds = {
      salary: new ObjectId(),
      investment: new ObjectId(),
      gift: new ObjectId(),
      otherIncome: new ObjectId(),
      housing: new ObjectId(),
      transportation: new ObjectId(),
      food: new ObjectId(),
      utilities: new ObjectId(),
      healthcare: new ObjectId(),
      entertainment: new ObjectId(),
      education: new ObjectId(),
      shopping: new ObjectId(),
      otherExpense: new ObjectId(),
    };
    
    if (collections.categories) {
      const categories = [
        // Income categories
        {
          _id: categoryIds.salary,
          name: 'Salary',
          type: CategoryType.INCOME,
          icon: 'cash',
          color: '#4CAF50',
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: categoryIds.investment,
          name: 'Investment',
          type: CategoryType.INCOME,
          icon: 'chart-line',
          color: '#2196F3',
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: categoryIds.gift,
          name: 'Gift',
          type: CategoryType.INCOME,
          icon: 'gift',
          color: '#9C27B0',
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: categoryIds.otherIncome,
          name: 'Other Income',
          type: CategoryType.INCOME,
          icon: 'plus-circle',
          color: '#607D8B',
          createdAt: now,
          updatedAt: now,
        },
        
        // Expense categories
        {
          _id: categoryIds.housing,
          name: 'Housing',
          type: CategoryType.EXPENSE,
          icon: 'home',
          color: '#FF5722',
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: categoryIds.transportation,
          name: 'Transportation',
          type: CategoryType.EXPENSE,
          icon: 'car',
          color: '#795548',
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: categoryIds.food,
          name: 'Food',
          type: CategoryType.EXPENSE,
          icon: 'restaurant',
          color: '#FFC107',
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: categoryIds.utilities,
          name: 'Utilities',
          type: CategoryType.EXPENSE,
          icon: 'flash',
          color: '#03A9F4',
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: categoryIds.healthcare,
          name: 'Healthcare',
          type: CategoryType.EXPENSE,
          icon: 'medical-bag',
          color: '#E91E63',
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: categoryIds.entertainment,
          name: 'Entertainment',
          type: CategoryType.EXPENSE,
          icon: 'movie',
          color: '#673AB7',
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: categoryIds.education,
          name: 'Education',
          type: CategoryType.EXPENSE,
          icon: 'school',
          color: '#3F51B5',
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: categoryIds.shopping,
          name: 'Shopping',
          type: CategoryType.EXPENSE,
          icon: 'cart',
          color: '#9E9E9E',
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: categoryIds.otherExpense,
          name: 'Other Expense',
          type: CategoryType.EXPENSE,
          icon: 'minus-circle',
          color: '#F44336',
          createdAt: now,
          updatedAt: now,
        },
      ];

      await collections.categories.insertMany(categories);
    }
    
    // Create sample transactions
    console.log('Creating sample transactions...');
    if (collections.transactions) {
      const transactions = [
        // Income transactions
        {
          _id: new ObjectId(),
          userId: userId.toString(),
          type: TransactionType.INCOME,
          categoryId: categoryIds.salary.toString(),
          amount: 5000,
          description: 'Monthly salary',
          date: new Date(2025, 6, 1), // July 1, 2025
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: new ObjectId(),
          userId: userId.toString(),
          type: TransactionType.INCOME,
          categoryId: categoryIds.investment.toString(),
          amount: 500,
          description: 'Stock dividends',
          date: new Date(2025, 6, 5), // July 5, 2025
          createdAt: now,
          updatedAt: now,
        },
        
        // Expense transactions
        {
          _id: new ObjectId(),
          userId: userId.toString(),
          type: TransactionType.EXPENSE,
          categoryId: categoryIds.housing.toString(),
          amount: 1200,
          description: 'Rent payment',
          date: new Date(2025, 6, 3), // July 3, 2025
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: new ObjectId(),
          userId: userId.toString(),
          type: TransactionType.EXPENSE,
          categoryId: categoryIds.food.toString(),
          amount: 350,
          description: 'Grocery shopping',
          date: new Date(2025, 6, 4), // July 4, 2025
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: new ObjectId(),
          userId: userId.toString(),
          type: TransactionType.EXPENSE,
          categoryId: categoryIds.utilities.toString(),
          amount: 120,
          description: 'Electricity bill',
          date: new Date(2025, 6, 6), // July 6, 2025
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: new ObjectId(),
          userId: userId.toString(),
          type: TransactionType.EXPENSE,
          categoryId: categoryIds.entertainment.toString(),
          amount: 80,
          description: 'Movie night',
          date: new Date(2025, 6, 7), // July 7, 2025
          createdAt: now,
          updatedAt: now,
        },
      ];

      await collections.transactions.insertMany(transactions);
    }



    // Create sample budgets
    console.log('Creating sample budgets...');
    if (collections.budgets) {
      const budgets = [
        {
          _id: new ObjectId(),
          userId: userId.toString(),
          categoryId: categoryIds.food.toString(),
          amount: 500,
          period: BudgetPeriod.MONTHLY,
          startDate: new Date(2025, 6, 1), // July 1, 2025
          endDate: new Date(2025, 6, 31), // July 31, 2025
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: new ObjectId(),
          userId: userId.toString(),
          categoryId: categoryIds.entertainment.toString(),
          amount: 200,
          period: BudgetPeriod.MONTHLY,
          startDate: new Date(2025, 6, 1), // July 1, 2025
          endDate: new Date(2025, 6, 31), // July 31, 2025
          createdAt: now,
          updatedAt: now,
        },
        {
          _id: new ObjectId(),
          userId: userId.toString(),
          categoryId: categoryIds.utilities.toString(),
          amount: 300,
          period: BudgetPeriod.MONTHLY,
          startDate: new Date(2025, 6, 1), // July 1, 2025
          endDate: new Date(2025, 6, 31), // July 31, 2025
          createdAt: now,
          updatedAt: now,
        },
      ];

      await collections.budgets.insertMany(budgets);
    }

    console.log('Seed completed successfully!');
    console.log('Test user credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await closeDatabase();
  }
}

// Run the seed function
seed();
