import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-700 mb-6">
          Personal Finance Dashboard
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-12">
          Track your income, expenses, and savings goals with a clean, interactive interface
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-8 py-3 text-lg font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="px-8 py-3 text-lg font-medium rounded-lg bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 transition-colors"
          >
            Register
          </Link>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Track Expenses" 
            description="Easily log and categorize your daily expenses to understand your spending habits."
            icon="📊"
          />
          <FeatureCard 
            title="Set Budgets" 
            description="Create monthly budgets for different categories and track your progress."
            icon="💰"
          />
          <FeatureCard 
            title="Visualize Data" 
            description="See your financial data through beautiful, interactive charts and graphs."
            icon="📈"
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-primary-700 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
