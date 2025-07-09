import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Create Budget | Personal Finance Dashboard',
  description: 'Create a new budget for your finances',
};

export default async function NewBudgetPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Create New Budget</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  defaultValue=""
                >
                  <option value="" disabled>Select a category</option>
                  <option value="food">Food & Dining</option>
                  <option value="transportation">Transportation</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="shopping">Shopping</option>
                  <option value="utilities">Utilities</option>
                  <option value="housing">Housing</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="personal">Personal Care</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="limit" className="block text-sm font-medium text-gray-700">
                  Monthly Limit (MYR)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="limit"
                    id="limit"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <select
                  id="color"
                  name="color"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  defaultValue="blue"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                  <option value="purple">Purple</option>
                  <option value="indigo">Indigo</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Add any notes about this budget"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <a
                href="/dashboard/budgets"
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </a>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
