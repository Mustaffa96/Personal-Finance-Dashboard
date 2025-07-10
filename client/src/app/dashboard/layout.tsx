import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth-options';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Session } from 'next-auth';

// Define the expected session structure
interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

// Use dynamic import with preload for the dashboard client
const DashboardClient = dynamic(() => import('./components/DashboardClient'), {
  ssr: true, // Enable server-side rendering for faster initial load
  loading: () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800">Loading dashboard...</h2>
      </div>
    </div>
  ),
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions) as CustomSession | null;

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  // Ensure session has user property with required fields
  const user = {
    id: session.user.id,
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null
  };

  return <DashboardClient user={user}>{children}</DashboardClient>;
}
