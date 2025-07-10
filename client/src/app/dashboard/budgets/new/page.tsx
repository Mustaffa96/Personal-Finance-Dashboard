import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth-options';
import { redirect } from 'next/navigation';
import CreateBudgetClient from './components/CreateBudgetClient';

export const metadata: Metadata = {
  title: 'Create Budget | Personal Finance Dashboard',
  description: 'Create a new budget for your finances',
};

export default async function NewBudgetPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return <CreateBudgetClient />;
}
