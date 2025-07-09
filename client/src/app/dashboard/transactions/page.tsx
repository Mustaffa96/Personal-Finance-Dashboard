import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import TransactionsClient from './components/TransactionsClient';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Transactions | Personal Finance Dashboard',
  description: 'Manage your financial transactions',
};

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  const userId = session.user.id;

  return <TransactionsClient userId={userId} />;
}
