'use client';

// Add priority loading hint
export const runtime = 'edge';
export const preferredRegion = 'auto';

import { useQuery } from '@tanstack/react-query';
import { TransactionType } from '@/domain/entities/Transaction';
import { useState, Suspense, useEffect, memo, useRef } from 'react';
import { ApiTransactionRepository } from '../../../adapters/repositories/TransactionRepository';
import { ApiCategoryRepository } from '../../../adapters/repositories/CategoryRepository';
import { TooltipItem } from 'chart.js';

// Interface for MongoDB ObjectId format
interface MongoObjectId {
  $oid: string;
}

// Type guard function to check if an object is a MongoObjectId
function isMongoObjectId(obj: unknown): obj is MongoObjectId {
  return obj !== null && typeof obj === 'object' && '$oid' in obj && typeof (obj as MongoObjectId).$oid === 'string';
}

// Import Chart.js components dynamically with improved loading placeholder
import dynamic from 'next/dynamic';

// Memoized loading placeholder with fixed dimensions to prevent layout shift
const ChartPlaceholder = memo(() => (
  <div className="animate-pulse bg-gradient-to-br from-blueGray-50 to-blueGray-100 rounded-xl shadow-sm flex items-center justify-center h-[350px] w-full" style={{contain: 'size layout', aspectRatio: '1/1'}}>
    <div className="text-sm text-blueGray-500 flex flex-col items-center gap-2">
      <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Loading chart...</span>
    </div>
  </div>
));
ChartPlaceholder.displayName = 'ChartPlaceholder';

// Skeleton loader component for the chart with fixed dimensions to prevent layout shift
const ChartSkeleton = () => (
  <div className="animate-pulse flex flex-col items-center justify-center h-[350px] w-full rounded-xl bg-white shadow-sm p-4" style={{contain: 'size layout'}}>
    <div className="rounded-full bg-gradient-to-br from-gray-100 to-gray-200" style={{ height: '250px', width: '250px', contain: 'size' }}>
      <div className="h-full w-full rounded-full border-8 border-gray-100 opacity-60"></div>
    </div>
    <div className="flex flex-wrap justify-center mt-6 gap-3 w-full" style={{contain: 'size layout'}}>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-20"></div>
      ))}
    </div>
  </div>
);

// Use Next.js dynamic imports with better loading experience
const PieChart = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Pie),
  { ssr: false, loading: () => <ChartPlaceholder /> }
);

// Type definition for ChartJS DataLabels plugin
type ChartJSDataLabels = any;

// Dynamically import Chart.js Datalabels plugin for enhanced chart labels
const importChartJsDataLabels = async () => {
  if (typeof window !== 'undefined') {
    try {
      // Use a type assertion to handle the import
      const dataLabelsModule = await import('chartjs-plugin-datalabels') as { default: ChartJSDataLabels };
      return dataLabelsModule.default;
    } catch (err) {
      console.error('Failed to load chartjs-plugin-datalabels:', err);
      return null;
    }
  }
  return null;
};

// Import Chart.js components dynamically with enhanced features
const importChartJs = async () => {
  if (typeof window !== 'undefined') {
    try {
      const ChartJS = await import('chart.js');
      const { ArcElement, Tooltip, Legend, Chart, Colors } = ChartJS;
      
      // Register required components
      Chart.register(ArcElement, Tooltip, Legend, Colors);
      
      // Try to import and register datalabels plugin
      try {
        // Use a type assertion to handle the import
        const dataLabelsModule = await import('chartjs-plugin-datalabels') as { default: ChartJSDataLabels };
        Chart.register(dataLabelsModule.default);
        console.log('Chart.js DataLabels plugin registered');
      } catch (err) {
        console.log('DataLabels plugin not available, continuing without it');
      }
      
      // Set default animations and transitions
      Chart.defaults.animation = {
        duration: 1000,
        easing: 'easeOutQuart'
      };
      
      // Set default font
      Chart.defaults.font.family = "'Inter', 'Open Sans', sans-serif";
      
      console.log('Chart.js components registered successfully');
      return true;
    } catch (error) {
      console.error('Error initializing Chart.js:', error);
      return false;
    }
  }
  return false;
};

// Chart.js registration will be done in useEffect

// Chart.js registration will happen in the lazy-loaded component

interface ExpenseCategoryChartProps {
  userId: string;
}

// Memoized empty state component
const EmptyState = memo(() => (
  <div className="py-10 text-center flex flex-col items-center justify-center" style={{height: '350px', contain: 'size layout'}}>
    <div className="h-20 w-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-sm" style={{aspectRatio: '1/1'}}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
    </div>
    <p className="text-base font-medium text-blueGray-700 mb-2">No expense data available</p>
    <p className="text-sm text-blueGray-500 max-w-xs mx-auto">Add some transactions to see your spending patterns visualized here.</p>
  </div>
));
EmptyState.displayName = 'EmptyState';

// Memoized timeframe selector component
const TimeframeSelector = memo(({ timeframe, setTimeframe }: { timeframe: 'month' | 'year', setTimeframe: (t: 'month' | 'year') => void }) => (
  <div className="flex space-x-2">
    <button
      onClick={() => setTimeframe('month')}
      className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm ${
        timeframe === 'month'
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-2 ring-blue-500 ring-opacity-50'
          : 'bg-white text-blueGray-700 hover:bg-blueGray-50 border border-blueGray-200'
      } transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
    >
      Month
    </button>
    <button
      onClick={() => setTimeframe('year')}
      className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm ${
        timeframe === 'year'
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-2 ring-blue-500 ring-opacity-50'
          : 'bg-white text-blueGray-700 hover:bg-blueGray-50 border border-blueGray-200'
      } transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
    >
      Year
    </button>
  </div>
));
TimeframeSelector.displayName = 'TimeframeSelector';

export default function ExpenseCategoryChart({ userId }: ExpenseCategoryChartProps) {
  const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');
  // State for tracking if component is mounted (for deferred loading)
  const [isMounted, setIsMounted] = useState(false);
  // State to track if Chart.js is initialized
  const [chartInitialized, setChartInitialized] = useState(false);
  // State for chart legend position
  const [legendPosition, setLegendPosition] = useState<'top' | 'right'>('top');
  
  const transactionRepository = new ApiTransactionRepository();
  const categoryRepository = new ApiCategoryRepository();
  
  // Initialize chart and register plugins
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let isMounted = true;
    let chartJsDataLabels: any = null;
    
    const initializeChart = async () => {
      try {
        await importChartJs();
        chartJsDataLabels = await importChartJsDataLabels();
        
        if (isMounted && chartJsDataLabels) {
          setChartInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize chart:', error);
      }
    };
    
    initializeChart();
    
    // Set initial legend position based on screen size
    if (typeof window !== 'undefined') {
      setLegendPosition(window.innerWidth < 768 ? 'top' : 'right');
    }
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Use effect to defer non-critical data loading
  useEffect(() => {
    // Set mounted immediately to start loading data faster
    setIsMounted(true);
    console.log('Component mounted, setting isMounted to true');
    
    // Debug the userId to ensure it's available
    console.log('Current userId:', userId);
    
    return () => {
      setIsMounted(false);
    };
  }, [userId]);
  
  // Get all transactions for the user with deferred loading
  const { data: transactions, isLoading: isLoadingTransactions, error: transactionsError } = useQuery({
    queryKey: ['transactions', userId],
    queryFn: () => transactionRepository.findByUserId(userId),
    enabled: !!userId && isMounted,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2, // Retry failed requests
    refetchOnWindowFocus: false // Prevent unnecessary refetches
  });

  // Direct fetch for category data with timeframe filter - similar to MonthlyTrendsChart approach
  const { data: categoryChartData, isLoading: isLoadingCategoryData, refetch: refetchCategoryData } = useQuery({
    queryKey: ['categoryChartData', userId, timeframe],
    queryFn: async () => {
      console.log('Fetching category chart data directly...');
      console.log('Using userId:', userId);
      try {
        // Fetch transactions
        const transactions = await transactionRepository.findByUserId(userId);
        console.log('Transactions fetched:', transactions ? transactions.length : 0);
        // Fetch categories
        const categories = await categoryRepository.findAll();
        console.log('Categories fetched:', categories ? categories.length : 0);
        
        if (!transactions || !categories) {
          console.log('No transactions or categories available');
          return null;
        }
        
        // Filter transactions by timeframe and type (expenses only)
        const now = new Date();
        // Use timeframe directly instead of monthCount variable
        const startDate = new Date(now);
        // Set start date to beginning of current month (for 'month') or beginning of year (for 'year')
        if (timeframe === 'month') {
          startDate.setDate(1); // First day of current month
          startDate.setHours(0, 0, 0, 0); // Beginning of the day
        } else {
          // For year timeframe
          startDate.setMonth(now.getMonth() - 11); // Go back 11 months (12 months total including current)
          startDate.setDate(1); // First day of that month
          startDate.setHours(0, 0, 0, 0); // Beginning of the day
        }
        
        // Set end date to current date at end of day
        const endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999); // End of the day
        
        console.log('Filtering transactions by timeframe:', { 
          timeframe, 
          startDate: startDate.toISOString(), 
          endDate: endDate.toISOString() 
        });
        
        const filteredTransactions = transactions.filter((t) => {
          const transactionDate = new Date(t.date);
          const isExpense = t.type === TransactionType.EXPENSE;
          const isInTimeframe = transactionDate >= startDate && transactionDate <= endDate;
          
          // Debug each transaction's date comparison
          if (isExpense && !isInTimeframe) {
            console.log(`Transaction ${t.id} excluded: date=${transactionDate.toISOString()}, outside range ${startDate.toISOString()} to ${endDate.toISOString()}`);
          }
          
          return isExpense && isInTimeframe;
        });
        
        // Group by category and calculate totals
        const categoryTotals: Record<string, number> = {};
        
        // Debug transactions
        console.log('Filtered transactions:', filteredTransactions.length);
        console.log('Sample transaction:', filteredTransactions.length > 0 ? filteredTransactions[0] : 'No transactions');
        
        // Add more detailed debugging for transaction dates
        if (filteredTransactions.length === 0 && transactions.length > 0) {
          console.log('Transaction date analysis:');
          transactions.slice(0, 3).forEach((t, index) => {
            const transactionDate = new Date(t.date);
            console.log(`Transaction ${index} (${t.id}):`); 
            console.log(`- Date: ${transactionDate.toISOString()}`);
            console.log(`- Type: ${t.type}`);
            console.log(`- Is Expense: ${t.type === TransactionType.EXPENSE}`);
            console.log(`- In timeframe: ${transactionDate >= startDate && transactionDate <= endDate}`);
            console.log(`- Compare with startDate: ${transactionDate >= startDate ? 'after/equal' : 'before'} ${startDate.toISOString()}`);
            console.log(`- Compare with endDate: ${transactionDate <= endDate ? 'before/equal' : 'after'} ${endDate.toISOString()}`);
          });
        }
        
        filteredTransactions.forEach(transaction => {
          // After refactoring, we should primarily use categoryId
          let categoryId = transaction.categoryId;
          
          // Debug the transaction categoryId
          console.log(`Transaction ${transaction.id} categoryId:`, categoryId, typeof categoryId);
          
          if (!categoryId) {
            console.log('Transaction missing categoryId:', transaction);
            // Try to use category as fallback if available
            if (transaction.category) {
              console.log('Using category as fallback for transaction:', transaction.id);
              categoryId = transaction.category;
              transaction.categoryId = transaction.category;
            } else {
              console.log('Transaction has neither categoryId nor category:', transaction);
              return;
            }
          }
          
          // Normalize categoryId to string if it's an object with toString method
          if (typeof categoryId === 'object' && categoryId !== null) {
            // Check if toString method exists on the object
            if (categoryId && 'toString' in categoryId && typeof (categoryId as { toString(): string }).toString === 'function') {
              categoryId = (categoryId as { toString(): string }).toString();
              console.log(`Normalized categoryId to string: ${categoryId}`);
            } else if (categoryId && typeof categoryId === 'object' && '$oid' in (categoryId as { $oid: string })) {
              // Handle MongoDB ObjectId format
              categoryId = (categoryId as { $oid: string }).$oid;
              console.log(`Extracted MongoDB ObjectId: ${categoryId}`);
            }
          }
          
          // Ensure categoryId is a string
          categoryId = String(categoryId);
          
          // Ensure we have a valid categoryId before using it as an index
          if (categoryId) {
            if (!categoryTotals[categoryId]) {
              categoryTotals[categoryId] = 0;
            }
            
            categoryTotals[categoryId] += transaction.amount;
          }
        });
        
        // Debug categories
        console.log('Categories:', categories.length);
        console.log('Sample category:', categories[0]);
        console.log('Category totals:', categoryTotals);
        
        // Map category IDs to names and colors
        const categoryIds = Object.keys(categoryTotals);
        
        // Log all category IDs and available categories for debugging
        console.log('All category IDs from transactions:', categoryIds);
        console.log('All available categories:', categories.map(c => {
          // Log each category's ID formats for debugging
          const idFormats = {
            id: c.id,
            _id: c._id,
            _idString: c._id ? c._id.toString() : undefined,
            _idOid: c._id && typeof c._id === 'object' && '$oid' in (c._id as { $oid: string }) ? (c._id as { $oid: string }).$oid : undefined,
            name: c.name
          };
          console.log(`Category ${c.name} ID formats:`, idFormats);
          return idFormats;
        }));
        
        // Ensure we have valid category IDs
        if (categoryIds.length === 0) {
          console.log('No category IDs found in transactions');
          return null;
        }
        
        const labels = categoryIds.map(id => {
          if (!id) {
            console.log('Invalid category ID found:', id);
            return 'Unknown Category';
          }
          
          // Try all possible matching approaches
          let category = null;
          
          // Try direct ID matching first
          category = categories.find(c => c.id === id);
          if (category) console.log(`Found category by id match: ${category.name}`);
          
          // Try _id direct match
          if (!category) {
            category = categories.find(c => c._id === id);
            if (category) console.log(`Found category by _id match: ${category.name}`);
          }
          
          // Try string comparison of _id
          if (!category) {
            category = categories.find(c => c._id && c._id.toString && c._id.toString() === id);
            if (category) console.log(`Found category by _id.toString() match: ${category.name}`);
          }
          
          // Try MongoDB ObjectId format
          if (!category) {
            category = categories.find(c => c._id && typeof c._id === 'object' && isMongoObjectId(c._id) && c._id.$oid === id);
          }
          
          // Try case-insensitive matching
          if (!category) {
            category = categories.find(c => 
              (c.id && c.id.toLowerCase() === id.toLowerCase()) || 
              (c._id && c._id.toString && c._id.toString().toLowerCase() === id.toLowerCase())
            );
            if (category) console.log(`Found category by case-insensitive match: ${category.name}`);
          }
          
          // Try partial matching as last resort
          if (!category) {
            category = categories.find(c => 
              (c.id && id.includes(c.id)) || 
              (c.id && c.id.includes(id)) ||
              (c._id && c._id.toString && (id.includes(c._id.toString()) || c._id.toString().includes(id)))
            );
            if (category) console.log(`Found category by partial match: ${category.name}`);
          }
          
          if (!category) {
            console.log(`Category not found for ID: ${id}`);
          } else {
            console.log(`Category found for ID ${id}:`, category.name);
          }
          
          return category?.name || `Unknown (${id})`;
        });
        
        const data = categoryIds.map(id => categoryTotals[id]);
        
        // Get colors from category data if available, otherwise use defaults
        const backgroundColors = categoryIds.map(id => {
          // Try all possible matching approaches (same as above for consistency)
          let category = null;
          
          // Try direct ID matching first
          category = categories.find(c => c.id === id);
          
          // Try _id direct match
          if (!category) {
            category = categories.find(c => c._id === id);
          }
          
          // Try string comparison of _id
          if (!category) {
            category = categories.find(c => c._id && c._id.toString && c._id.toString() === id);
          }
          
          // Try MongoDB ObjectId format
          if (!category) {
            category = categories.find(c => c._id && typeof c._id === 'object' && isMongoObjectId(c._id) && c._id.$oid === id);
          }
          
          // Try case-insensitive matching
          if (!category) {
            category = categories.find(c => 
              (c.id && c.id.toLowerCase() === id.toLowerCase()) || 
              (c._id && c._id.toString && c._id.toString().toLowerCase() === id.toLowerCase())
            );
          }
          
          // Try partial matching as last resort
          if (!category) {
            category = categories.find(c => 
              (c.id && id.includes(c.id)) || 
              (c.id && c.id.includes(id)) ||
              (c._id && c._id.toString && (id.includes(c._id.toString()) || c._id.toString().includes(id)))
            );
          }
          
          const color = category?.color || getRandomColor(id);
          console.log(`Color for category ${id}:`, color);
          return color;
        });
        
        const chartData = {
          labels,
          datasets: [
            {
              label: 'Expenses by Category',
              data,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map(color => adjustColor(color, -20)),
              borderWidth: 1,
            },
          ],
        };
        
        console.log('Chart data fetched successfully:', chartData);
        return chartData;
      } catch (error) {
        console.error('Error fetching category chart data:', error);
        return null;
      }
    },
    enabled: !!userId && isMounted && chartInitialized,
    staleTime: 30 * 1000, // 30 seconds
    retry: 2
  });

  // Log any errors
  useEffect(() => {
    if (transactionsError) {
      console.error('Transaction query error:', transactionsError);
      // Try to extract more detailed error information
      const errorDetails = transactionsError instanceof Error ? transactionsError.message : 'Unknown error';
      console.error('Transaction error details:', errorDetails);
    }
  }, [transactionsError]);

  // Make sure we consider all loading states
  const isLoading = isLoadingTransactions || isLoadingCategoryData || !isMounted || !chartInitialized;
  
  // Debug when loading state changes
  useEffect(() => {
    if (!isLoading && categoryChartData === null) {
      console.log('Loading finished but chart data is still null. Checking conditions:');
      console.log('- userId available:', !!userId);
      console.log('- isMounted:', isMounted);
      console.log('- chartInitialized:', chartInitialized);
      console.log('- transactions available:', !!transactions && transactions.length > 0);
    }
  }, [isLoading, categoryChartData, userId, isMounted, chartInitialized, transactions]);
  
  // Debug loading states
  useEffect(() => {
    console.log('Loading states:', { 
      chartInitialized,
      isLoading,
      isLoadingCategoryData,
      isLoadingTransactions,
      isMounted 
    });
    
    // If all conditions are met but we still don't have data, manually trigger a refetch
    if (isMounted && chartInitialized && !isLoadingCategoryData && !categoryChartData && userId) {
      console.log('All conditions met but no data, triggering manual refetch');
      refetchCategoryData();
    }
  }, [isLoadingTransactions, isLoadingCategoryData, isMounted, chartInitialized, isLoading, categoryChartData, userId, refetchCategoryData]);

  // Helper function to generate consistent random colors based on string with improved palette
  const getRandomColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use a predefined palette of visually pleasing colors
    const colorPalette = [
      '#3B82F6', // blue-500
      '#10B981', // emerald-500
      '#F59E0B', // amber-500
      '#EF4444', // red-500
      '#8B5CF6', // violet-500
      '#EC4899', // pink-500
      '#06B6D4', // cyan-500
      '#84CC16', // lime-500
      '#6366F1', // indigo-500
      '#F97316', // orange-500
      '#14B8A6', // teal-500
      '#D946EF'  // fuchsia-500
    ];
    
    // Use the hash to select a color from the palette
    const index = Math.abs(hash) % colorPalette.length;
    return colorPalette[index];
  };

  // Helper function to adjust color brightness with improved algorithm
  const adjustColor = (color: string, amount: number) => {
    // Handle non-hex colors or empty values
    if (!color || !color.startsWith('#')) {
      return color;
    }
    
    // Remove # if present
    color = color.replace(/^#/, '');
    
    // Convert 3-digit hex to 6-digit hex
    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    
    // Adjust each color component
    return '#' + color.replace(/../g, colorHex => {
      const num = Math.min(255, Math.max(0, parseInt(colorHex, 16) + amount));
      return ('0' + num.toString(16)).slice(-2);
    });
  };

  // Define responsive legend position based on window width
  const getLegendPosition = () => {
    if (typeof window === 'undefined') return 'top';
    return window.innerWidth < 768 ? 'top' : 'right';
  };

  // Chart options - defined outside the render to prevent recreation
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeOutQuart' as const
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
    plugins: {
      legend: {
        position: legendPosition,
        align: 'center' as const,
        labels: {
          boxWidth: 15,
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: "'Inter', 'Open Sans', sans-serif",
            weight: 500 // Changed from string to number to match Chart.js type
          },
          color: '#8898aa'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#5e72e4',
        bodyColor: '#525f7f',
        borderColor: '#e9ecef',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(tooltipItem: TooltipItem<'pie'>) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.parsed;
            const total = tooltipItem.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        },
        bodyFont: {
          size: 13,
          family: "'Inter', 'Open Sans', sans-serif"
        },
        titleFont: {
          size: 14,
          family: "'Inter', 'Open Sans', sans-serif",
          weight: 600 // Changed from string to number to match Chart.js type
        }
      },
      datalabels: {
        display: false
      }
    },
    cutout: '60%',
    radius: '90%'
  };

  interface ChartProps {
    data: {
      labels: string[];
      datasets: Array<{
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
      }>;
    };
    options: typeof chartOptions;
  }

  // Memoize the chart component to prevent unnecessary re-renders and ensure consistent dimensions
  const Chart = memo(({ data, options }: ChartProps) => {
    // Responsive adjustment based on window width
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      if (typeof window === 'undefined') return;
      
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      
      // Create a resize observer to handle container size changes
      const resizeObserver = new ResizeObserver(() => {
        // Trigger a state update to re-render the chart with new dimensions
        setWindowWidth(window.innerWidth);
      });
      
      // Observe the chart container
      if (chartContainerRef.current) {
        resizeObserver.observe(chartContainerRef.current);
      }
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        resizeObserver.disconnect();
      };
    }, []);
    
    // Adjust chart layout based on screen size
    const chartLayout = windowWidth < 768 ? 'flex flex-col items-center' : 'flex flex-row items-center';
    
    return (
      <div ref={chartContainerRef} className={`relative ${chartLayout} justify-center h-auto w-full rounded-xl bg-white p-4 shadow-sm transition-all duration-300`} 
           style={{contain: 'size layout', minHeight: '350px'}}>
        <div className={`${windowWidth < 768 ? 'w-full h-[300px]' : 'w-3/4 h-[350px]'} transition-all duration-300`}>
          <Suspense fallback={<ChartPlaceholder />}>
            <PieChart data={data} options={{
              ...options,
              plugins: {
                ...options.plugins,
                legend: {
                  ...options.plugins.legend,
                  position: windowWidth < 768 ? 'bottom' as const : 'right' as const
                }
              }
            }} />
          </Suspense>
        </div>
        
        {/* Total amount display in center of chart */}
        {data.datasets[0].data.length > 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-xs text-blueGray-500 font-medium">TOTAL</div>
            <div className="text-lg font-bold text-blueGray-800">
              ${data.datasets[0].data.reduce((a, b) => a + b, 0).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    );
  });
  Chart.displayName = 'Chart';

  // Add enhanced debugging for chart data and component state
  useEffect(() => {
    if (categoryChartData) {
      console.log('Chart data ready:', categoryChartData);
      console.log('Chart data length:', categoryChartData.datasets[0].data.length);
      console.log('Chart labels:', categoryChartData.labels);
    } else {
      console.log('Chart data is null');
      // Log component state to help diagnose the issue
      console.log('Component state:', {
        userId,
        timeframe,
        isMounted,
        chartInitialized,
        isLoadingTransactions,
        isLoadingCategoryData,
        transactionsAvailable: !!transactions && transactions.length > 0
      });
      
      // Check if userId is valid
      if (!userId) {
        console.error('UserId is missing or invalid:', userId);
      }
      
      // Check if API endpoints are correctly configured
      console.log('API endpoints:', {
        transactions: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/transactions?userId=${userId}`,
        categories: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/categories`
      });
    }
  }, [categoryChartData, userId, timeframe, isMounted, chartInitialized, isLoadingTransactions, isLoadingCategoryData, transactions]);

  // Render a static placeholder first to improve LCP
  // Then replace with dynamic content when data is loaded
  if (isLoading || !categoryChartData) {
    console.log('Rendering skeleton, loading state:', { isLoading, hasCategoryChartData: !!categoryChartData });
    return <ChartSkeleton />;
  }

  return (
    <div className="flex flex-col w-full transition-all duration-300" style={{contain: 'content', minHeight: '450px'}}>
      <div className="flex items-center justify-between mb-4 p-2">
        <h3 className="text-lg font-semibold text-blueGray-800">Expense Breakdown</h3>
        <TimeframeSelector timeframe={timeframe} setTimeframe={setTimeframe} />
      </div>

      {/* Show a static placeholder during initial load to improve LCP */}
      <div className="flex-grow transition-all duration-300 rounded-xl overflow-hidden">
        {isLoading ? (
          <ChartPlaceholder />
        ) : categoryChartData && categoryChartData.datasets[0].data.length > 0 ? (
          <Chart data={categoryChartData} options={chartOptions} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm h-full">
            <EmptyState />
            <div className="text-sm text-center pb-4 text-blueGray-500">
              {isLoadingCategoryData ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading categories...
                </div>
              ) : isLoadingTransactions ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading transactions...
                </div>
              ) : transactions && transactions.length === 0 ? (
                'No transactions found'
              ) : (
                'No expense data available for the selected timeframe'
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
