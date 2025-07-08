import { Hono } from 'hono';
import { Budget } from '../models/Budget.js';
import { Transaction } from '../models/Transaction.js';
import { auth } from './auth.js';

const budgetRoutes = new Hono();

// Apply auth middleware to all routes
budgetRoutes.use('*', auth);

// Get all budgets for a user
budgetRoutes.get('/', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const { active = 'true' } = c.req.query();

    const query: any = { user: userId };

    // Filter for active budgets only if requested
    if (active === 'true') {
      const now = new Date();
      query.$or = [
        { endDate: { $gte: now } },
        { endDate: { $exists: false } }
      ];
    }

    const budgets = await Budget.find(query).sort({ category: 1 });

    return c.json({
      success: true,
      count: budgets.length,
      data: budgets,
    });
  } catch (error: any) {
    console.error('Get budgets error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to get budgets' 
    }, 500);
  }
});

// Get a single budget
budgetRoutes.get('/:id', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const budgetId = c.req.param('id');

    const budget = await Budget.findOne({
      _id: budgetId,
      user: userId,
    });

    if (!budget) {
      return c.json({ success: false, message: 'Budget not found' }, 404);
    }

    return c.json({
      success: true,
      data: budget,
    });
  } catch (error: any) {
    console.error('Get budget error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to get budget' 
    }, 500);
  }
});

// Create a new budget
budgetRoutes.post('/', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const { category, amount, period, startDate, endDate } = await c.req.json();

    // Check if a budget for this category already exists
    const existingBudget = await Budget.findOne({
      user: userId,
      category,
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: new Date() } }
      ]
    });

    if (existingBudget) {
      return c.json({ 
        success: false, 
        message: 'A budget for this category already exists' 
      }, 400);
    }

    const budget = await Budget.create({
      user: userId,
      category,
      amount,
      period: period || 'monthly',
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return c.json({
      success: true,
      data: budget,
    }, 201);
  } catch (error: any) {
    console.error('Create budget error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to create budget' 
    }, 500);
  }
});

// Update a budget
budgetRoutes.put('/:id', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const budgetId = c.req.param('id');
    const updates = await c.req.json();

    // Find and update the budget
    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, user: userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return c.json({ success: false, message: 'Budget not found' }, 404);
    }

    return c.json({
      success: true,
      data: budget,
    });
  } catch (error: any) {
    console.error('Update budget error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to update budget' 
    }, 500);
  }
});

// Delete a budget
budgetRoutes.delete('/:id', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const budgetId = c.req.param('id');

    const budget = await Budget.findOneAndDelete({
      _id: budgetId,
      user: userId,
    });

    if (!budget) {
      return c.json({ success: false, message: 'Budget not found' }, 404);
    }

    return c.json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete budget error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to delete budget' 
    }, 500);
  }
});

// Get budget progress (actual spending vs budget)
budgetRoutes.get('/:id/progress', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const budgetId = c.req.param('id');

    // Get the budget
    const budget = await Budget.findOne({
      _id: budgetId,
      user: userId,
    });

    if (!budget) {
      return c.json({ success: false, message: 'Budget not found' }, 404);
    }

    // Calculate date range for spending
    const now = new Date();
    let startDate = new Date(budget.startDate);
    
    if (budget.period === 'monthly') {
      // If it's a monthly budget, get spending for the current month
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get total spending for this category in the period
    const spendingResult = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          category: budget.category,
          date: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const spent = spendingResult.length > 0 ? spendingResult[0].total : 0;
    const remaining = budget.amount - spent;
    const percentUsed = (spent / budget.amount) * 100;

    return c.json({
      success: true,
      data: {
        budget: budget.amount,
        spent,
        remaining,
        percentUsed,
        category: budget.category,
        period: budget.period,
        isOverBudget: spent > budget.amount,
      },
    });
  } catch (error: any) {
    console.error('Budget progress error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to get budget progress' 
    }, 500);
  }
});

// Get all budget progress for a user
budgetRoutes.get('/progress/all', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;

    // Get all active budgets
    const budgets = await Budget.find({
      user: userId,
      $or: [
        { endDate: { $gte: new Date() } },
        { endDate: { $exists: false } }
      ]
    });

    if (budgets.length === 0) {
      return c.json({
        success: true,
        data: [],
      });
    }

    // Calculate date range for spending
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get spending by category
    const spendingByCategory = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: now },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Create a map of category to spending
    const spendingMap = new Map<string, number>();
    spendingByCategory.forEach((item: { _id: string; total: number }) => {
      spendingMap.set(item._id, item.total);
    });

    // Calculate progress for each budget
    const budgetProgress = budgets.map((budget: any) => {
      const spent = spendingMap.get(budget.category) || 0;
      const remaining = budget.amount - spent;
      const percentUsed = (spent / budget.amount) * 100;

      return {
        id: budget._id,
        category: budget.category,
        budget: budget.amount,
        spent,
        remaining,
        percentUsed,
        isOverBudget: spent > budget.amount,
      };
    });

    return c.json({
      success: true,
      data: budgetProgress,
    });
  } catch (error: any) {
    console.error('All budget progress error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to get budget progress' 
    }, 500);
  }
});

export { budgetRoutes };
