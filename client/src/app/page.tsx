import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Redirect to dashboard if logged in, otherwise to login page
  if (session) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }

  // This won't be reached due to redirects, but needed for TypeScript
  return null;
}
