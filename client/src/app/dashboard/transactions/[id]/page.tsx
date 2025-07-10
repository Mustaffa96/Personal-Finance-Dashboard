import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth-options';
import { redirect } from 'next/navigation';
import ViewTransactionClient from './components/ViewTransactionClient';

export const metadata: Metadata = {
  title: 'View Transaction | Personal Finance Dashboard',
  description: 'View transaction details',
};

export default async function ViewTransactionPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }
  
  const userId = session.user.id;
  const transactionId = params.id;

  return <ViewTransactionClient userId={userId} transactionId={transactionId} />;
}
