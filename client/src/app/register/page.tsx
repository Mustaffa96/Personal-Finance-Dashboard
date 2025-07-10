import { Metadata } from 'next';
import RegisterForm from './components/RegisterForm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth-options';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Register | Personal Finance Dashboard',
  description: 'Create a new Personal Finance Dashboard account',
};

export default async function RegisterPage() {
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
          <h2 className="mt-6 text-xl font-semibold text-gray-700">Create your account</h2>
        </div>
        <RegisterForm />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
