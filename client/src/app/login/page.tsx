import { Metadata } from 'next';
import LoginForm from './components/LoginForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login | Personal Finance Dashboard',
  description: 'Login to your Personal Finance Dashboard account',
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Redirect to dashboard if already logged in
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Personal Finance Dashboard</h1>
          <h2 className="mt-6 text-xl font-semibold text-gray-700">Sign in to your account</h2>
        </div>
        <LoginForm />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
