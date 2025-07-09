import { Metadata } from 'next';
import { formatCurrency } from '@/lib/utils/formatters';

export const metadata: Metadata = {
  title: 'Budgets | Personal Finance Dashboard',
  description: 'Manage your financial budgets',
};

export default async function BudgetsPage() {
  // Commented out until we implement budget fetching
  // const session = await getServerSession(authOptions);
  // We'll use session.user.id when we implement budget fetching

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <a 
          href="/dashboard/budgets/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Create Budget
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {/* Sample budget cards - these would be dynamically generated */}
        <BudgetCard 
          category="Food & Dining" 
          spent={350} 
          limit={500} 
          color="blue"
        />
        <BudgetCard 
          category="Transportation" 
          spent={120} 
          limit={200} 
          color="green"
        />
        <BudgetCard 
          category="Entertainment" 
          spent={180} 
          limit={150} 
          color="red"
        />
        <BudgetCard 
          category="Shopping" 
          spent={250} 
          limit={300} 
          color="purple"
        />
        <BudgetCard 
          category="Utilities" 
          spent={100} 
          limit={150} 
          color="yellow"
        />
        <BudgetCard 
          category="Housing" 
          spent={800} 
          limit={1000} 
          color="indigo"
        />
      </div>
    </div>
  );
}

// Budget card component
function BudgetCard({ 
  category, 
  spent, 
  limit, 
  color 
}: { 
  category: string; 
  spent: number; 
  limit: number; 
  color: string;
}) {
  const percentage = Math.min(Math.round((spent / limit) * 100), 100);
  const isOverBudget = spent > limit;
  
  // Determine color classes based on percentage and provided color
  const getColorClasses = () => {
    if (isOverBudget) {
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        progress: 'bg-red-500',
      };
    }
    
    const colorMap: Record<string, { bg: string; text: string; progress: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-800', progress: 'bg-blue-500' },
      green: { bg: 'bg-green-100', text: 'text-green-800', progress: 'bg-green-500' },
      red: { bg: 'bg-red-100', text: 'text-red-800', progress: 'bg-red-500' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', progress: 'bg-yellow-500' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-800', progress: 'bg-purple-500' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', progress: 'bg-indigo-500' },
    };
    
    return colorMap[color] || colorMap.blue;
  };
  
  const colorClasses = getColorClasses();
  
  return (
    <div className={`${colorClasses.bg} rounded-lg shadow p-6`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-medium ${colorClasses.text}`}>{category}</h3>
        <span className={`text-sm font-semibold ${isOverBudget ? 'text-red-600' : colorClasses.text}`}>
          {formatCurrency(spent)} / {formatCurrency(limit)}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`${colorClasses.progress} h-2.5 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <span className="text-xs text-gray-500">{percentage}% used</span>
        {isOverBudget && (
          <span className="text-xs font-medium text-red-600">
            Over budget by {formatCurrency(spent - limit)}
          </span>
        )}
      </div>
    </div>
  );
}
