import { Metadata } from 'next';
import BudgetsClient from './components/BudgetsClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Budgets | Personal Finance Dashboard',
  description: 'Manage your financial budgets',
};

export default async function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <a 
          href="/dashboard/budgets/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Create Budget
        </a>
      </div>
      
      <Suspense fallback={<div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>}>
        <BudgetsClient />
      </Suspense>
    </div>
  );
}


