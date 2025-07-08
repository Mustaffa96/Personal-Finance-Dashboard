'use client';

interface OverviewCardProps {
  title: string;
  amount: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  icon: string;
}

export default function OverviewCard({
  title,
  amount,
  trend,
  trendDirection,
  icon,
}: OverviewCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{amount}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
      <div className="mt-4">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            trendDirection === 'up'
              ? 'bg-green-100 text-green-800'
              : trendDirection === 'down'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {trendDirection === 'up' && '↑ '}
          {trendDirection === 'down' && '↓ '}
          {trend}
        </span>
        <span className="ml-2 text-xs text-gray-500">vs last month</span>
      </div>
    </div>
  );
}
