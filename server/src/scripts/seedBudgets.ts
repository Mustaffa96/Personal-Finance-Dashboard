// Import necessary modules
import { connectToDatabase, collections } from '../infrastructure/database/mongodb';
import { BudgetPeriod } from '../domain/entities/Budget';
import { CategoryType } from '../domain/entities/Category';

// Logger utility to avoid console warnings
const logger = {
  log: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.log(...args);
  },
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
};

async function seedBudgets() {
  try {
    await connectToDatabase();
    
    if (!collections.budgets || !collections.users || !collections.categories) {
      throw new Error('Collections not initialized');
    }
    
    // Find a user to associate budgets with
    const user = await collections.users.findOne({});
    
    if (!user) {
      logger.log('No users found. Please run the user seeder first.');
      process.exit(1);
    }
    
    const userId = user._id.toString();
    
    // Fetch expense categories
    const categories = await collections.categories.find({ type: CategoryType.EXPENSE }).toArray();
    
    if (categories.length === 0) {
      logger.log('No expense categories found. Please run the category seeder first.');
      process.exit(1);
    }
    
    // Create a map of category names to IDs for easier reference
    const categoryMap: Record<string, string> = {};
    categories.forEach(category => {
      categoryMap[category.name.toLowerCase()] = category._id.toString();
    });
    
    // Delete existing budgets for this user
    await collections.budgets.deleteMany({ userId });
    
    // Current date for reference
    const now = new Date();
    
    // Create start and end dates for monthly budget
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
    
    // Sample budgets with category IDs
    const budgets = [
      {
        userId,
        categoryId: categoryMap['housing'] || categories[0]._id.toString(), // Fallback to first category if not found
        amount: 1200,
        period: BudgetPeriod.MONTHLY,
        startDate,
        endDate,
        createdAt: now,
        updatedAt: now,
      },
      {
        userId,
        categoryId: categoryMap['food'] || categories[1]._id.toString(),
        amount: 500,
        period: BudgetPeriod.MONTHLY,
        startDate,
        endDate,
        createdAt: now,
        updatedAt: now,
      },
      {
        userId,
        categoryId: categoryMap['transportation'] || categories[2]._id.toString(),
        amount: 300,
        period: BudgetPeriod.MONTHLY,
        startDate,
        endDate,
        createdAt: now,
        updatedAt: now,
      },
      {
        userId,
        categoryId: categoryMap['entertainment'] || categories[3]._id.toString(),
        amount: 200,
        period: BudgetPeriod.MONTHLY,
        startDate,
        endDate,
        createdAt: now,
        updatedAt: now,
      },
      {
        userId,
        categoryId: categoryMap['utilities'] || categories[4]._id.toString(),
        amount: 150,
        period: BudgetPeriod.MONTHLY,
        startDate,
        endDate,
        createdAt: now,
        updatedAt: now,
      },
    ];
    
    // Insert budgets
    const result = await collections.budgets.insertMany(budgets);
    
    logger.log(`${result.insertedCount} budgets successfully seeded`);
    logger.log('Sample budgets created for user:', userId);
    
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding budgets:', error);
    process.exit(1);
  }
}

// Run the seeder
seedBudgets();
