import mongoose from 'mongoose';

export interface IBudget {
  user: mongoose.Types.ObjectId;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new mongoose.Schema<IBudget>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    period: {
      type: String,
      enum: {
        values: ['monthly', 'yearly'],
        message: '{VALUE} is not supported',
      },
      default: 'monthly',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for faster queries
budgetSchema.index({ user: 1, category: 1 });
budgetSchema.index({ user: 1, startDate: -1 });

export const Budget = mongoose.model<IBudget>('Budget', budgetSchema);
