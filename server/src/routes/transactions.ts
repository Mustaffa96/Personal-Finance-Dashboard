import { Hono } from 'hono';
import { Transaction } from '../models/Transaction.js';
import { auth } from './auth.js';

const transactionRoutes = new Hono();

// Apply auth middleware to all routes
transactionRoutes.use('*', auth);

// Get all transactions for a user
transactionRoutes.get('/', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const { 
      type, 
      category, 
      startDate, 
      endDate, 
      limit = '50', 
      page = '1' 
    } = c.req.query();

    const query: any = { user: userId };

    // Apply filters if provided
    if (type) query.type = type;
    if (category) query.category = category;
    
    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get transactions with pagination
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    return c.json({
      success: true,
      count: transactions.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: transactions,
    });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to get transactions' 
    }, 500);
  }
});

// Get a single transaction
transactionRoutes.get('/:id', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const transactionId = c.req.param('id');

    const transaction = await Transaction.findOne({
      _id: transactionId,
      user: userId,
    });

    if (!transaction) {
      return c.json({ success: false, message: 'Transaction not found' }, 404);
    }

    return c.json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    console.error('Get transaction error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to get transaction' 
    }, 500);
  }
});

// Create a new transaction
transactionRoutes.post('/', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const { amount, type, category, description, date } = await c.req.json();

    const transaction = await Transaction.create({
      user: userId,
      amount,
      type,
      category,
      description,
      date: date ? new Date(date) : new Date(),
    });

    return c.json({
      success: true,
      data: transaction,
    }, 201);
  } catch (error: any) {
    console.error('Create transaction error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to create transaction' 
    }, 500);
  }
});

// Update a transaction
transactionRoutes.put('/:id', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const transactionId = c.req.param('id');
    const updates = await c.req.json();

    // Find and update the transaction
    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, user: userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return c.json({ success: false, message: 'Transaction not found' }, 404);
    }

    return c.json({
      success: true,
      data: transaction,
    });
  } catch (error: any) {
    console.error('Update transaction error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to update transaction' 
    }, 500);
  }
});

// Delete a transaction
transactionRoutes.delete('/:id', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const transactionId = c.req.param('id');

    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      user: userId,
    });

    if (!transaction) {
      return c.json({ success: false, message: 'Transaction not found' }, 404);
    }

    return c.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete transaction error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to delete transaction' 
    }, 500);
  }
});

// Get transaction summary (for dashboard)
transactionRoutes.get('/summary', async (c) => {
  try {
    const userId = c.get('jwtPayload').id;
    const { period = 'month' } = c.req.query();

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    }

    // Get total income
    const incomeResult = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'income',
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

    // Get total expenses
    const expenseResult = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
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

    // Get expenses by category
    const expensesByCategory = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
    const totalExpenses = expenseResult.length > 0 ? expenseResult[0].total : 0;
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return c.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        balance,
        savingsRate,
        expensesByCategory,
        period,
      },
    });
  } catch (error: any) {
    console.error('Transaction summary error:', error);
    return c.json({ 
      success: false, 
      message: error.message || 'Failed to get transaction summary' 
    }, 500);
  }
});

export { transactionRoutes };
