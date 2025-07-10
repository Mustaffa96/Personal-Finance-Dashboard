import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../lib/auth-options';
import { redirect } from 'next/navigation';
import EditTransactionClient from './components/EditTransactionClient';

export const metadata: Metadata = {
  title: 'Edit Transaction | Personal Finance Dashboard',
  description: 'Edit transaction details',
};

export default async function EditTransactionPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  const userId = session.user.id;
  const transactionId = params.id;

  return <EditTransactionClient userId={userId} transactionId={transactionId} />;
}
