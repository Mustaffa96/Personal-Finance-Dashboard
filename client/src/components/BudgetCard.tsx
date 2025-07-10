import { formatCurrency } from '@/lib/utils/formatters';

interface BudgetCardProps { 
  categoryId?: string; 
  categoryName: string; 
  spent: number; 
  limit: number; 
  color: string;
}

export default function BudgetCard({ categoryName, spent, limit, color }: BudgetCardProps) {
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
        <h3 className={`font-medium ${colorClasses.text}`}>{categoryName}</h3>
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
