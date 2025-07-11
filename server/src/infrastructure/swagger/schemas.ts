import { FastifySchema } from 'fastify';

// User schemas
export const userSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    email: { type: 'string', format: 'email' },
    name: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

export const userResponseSchema = {
  type: 'object',
  properties: {
    user: userSchema
  }
};

// Auth schemas
export const loginRequestSchema: FastifySchema = {
  description: 'User login',
  tags: ['auth'],
  summary: 'Authenticate a user and return a JWT token',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 }
    }
  },
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        token: { type: 'string' },
        user: userSchema
      }
    },
    401: {
      description: 'Invalid credentials',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};

export const registerRequestSchema: FastifySchema = {
  description: 'User registration',
  tags: ['auth'],
  summary: 'Register a new user',
  body: {
    type: 'object',
    required: ['email', 'password', 'name'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      name: { type: 'string' }
    }
  },
  response: {
    201: {
      description: 'User created successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: userSchema
      }
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    409: {
      description: 'User already exists',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};

// Transaction schemas
export const transactionSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    userId: { type: 'string' },
    amount: { type: 'number' },
    description: { type: 'string' },
    categoryId: { type: 'string' },
    date: { type: 'string', format: 'date-time' },
    type: { type: 'string', enum: ['income', 'expense'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

export const createTransactionSchema: FastifySchema = {
  description: 'Create a new transaction',
  tags: ['transactions'],
  summary: 'Create a new transaction for the authenticated user',
  body: {
    type: 'object',
    required: ['amount', 'description', 'categoryId', 'date', 'type'],
    properties: {
      amount: { type: 'number' },
      description: { type: 'string' },
      categoryId: { type: 'string' },
      date: { type: 'string', format: 'date-time' },
      type: { type: 'string', enum: ['income', 'expense'] }
    }
  },
  response: {
    201: {
      description: 'Transaction created successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
        transaction: transactionSchema
      }
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};

export const getTransactionsSchema: FastifySchema = {
  description: 'Get all transactions',
  tags: ['transactions'],
  summary: 'Get all transactions for the authenticated user',
  querystring: {
    type: 'object',
    properties: {
      limit: { type: 'integer', default: 10 },
      page: { type: 'integer', default: 1 },
      type: { type: 'string', enum: ['income', 'expense'] },
      categoryId: { type: 'string' },
      startDate: { type: 'string', format: 'date-time' },
      endDate: { type: 'string', format: 'date-time' }
    }
  },
  response: {
    200: {
      description: 'List of transactions',
      type: 'object',
      properties: {
        transactions: {
          type: 'array',
          items: transactionSchema
        },
        total: { type: 'integer' },
        page: { type: 'integer' },
        limit: { type: 'integer' },
        pages: { type: 'integer' }
      }
    }
  }
};

// Budget schemas
export const budgetSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    userId: { type: 'string' },
    categoryId: { type: 'string' },
    amount: { type: 'number' },
    month: { type: 'integer', minimum: 1, maximum: 12 },
    year: { type: 'integer' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

export const createBudgetSchema: FastifySchema = {
  description: 'Create a new budget',
  tags: ['budgets'],
  summary: 'Create a new budget for the authenticated user',
  body: {
    type: 'object',
    required: ['categoryId', 'amount', 'month', 'year'],
    properties: {
      categoryId: { type: 'string' },
      amount: { type: 'number' },
      month: { type: 'integer', minimum: 1, maximum: 12 },
      year: { type: 'integer' }
    }
  },
  response: {
    201: {
      description: 'Budget created successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
        budget: budgetSchema
      }
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};

// Category schemas
export const categorySchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    icon: { type: 'string' },
    color: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

export const getCategoriesSchema: FastifySchema = {
  description: 'Get all categories',
  tags: ['categories'],
  summary: 'Get all available categories',
  response: {
    200: {
      description: 'List of categories',
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          items: categorySchema
        }
      }
    }
  }
};
