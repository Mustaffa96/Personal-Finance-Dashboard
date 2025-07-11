import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/auth-options';
import LandingPage from './components/landing/LandingPage';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // If user is already logged in, they will be able to access dashboard directly from the landing page
  // We're not redirecting automatically to provide a better user experience with the landing page
  
  return (
    <LandingPage isLoggedIn={!!session} />
  );
}
