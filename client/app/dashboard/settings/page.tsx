'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('general');
  
  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and application settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 border-r border-gray-200">
            <nav className="p-4 space-y-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'general'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">⚙️</span>
                General
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'notifications'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">🔔</span>
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'security'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">🔒</span>
                Security
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'appearance'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">🎨</span>
                Appearance
              </button>
              <button
                onClick={() => setActiveTab('integrations')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'integrations'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">🔌</span>
                Integrations
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'data'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">💾</span>
                Data Management
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6">
            {activeTab === 'general' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Currency</h3>
                    <select className="p-2 border border-gray-300 rounded-md w-full max-w-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="USD">USD - US Dollar ($)</option>
                      <option value="EUR">EUR - Euro (€)</option>
                      <option value="GBP">GBP - British Pound (£)</option>
                      <option value="JPY">JPY - Japanese Yen (¥)</option>
                      <option value="CAD">CAD - Canadian Dollar (C$)</option>
                      <option value="AUD">AUD - Australian Dollar (A$)</option>
                      <option value="MYR">MYR - Malaysian Ringgit (RM)</option>
                    </select>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Date Format</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="radio" id="dateFormat1" name="dateFormat" className="h-4 w-4 text-primary-600 focus:ring-primary-500" defaultChecked />
                        <label htmlFor="dateFormat1" className="ml-2 text-sm text-gray-700">MM/DD/YYYY (e.g., 07/08/2025)</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="dateFormat2" name="dateFormat" className="h-4 w-4 text-primary-600 focus:ring-primary-500" />
                        <label htmlFor="dateFormat2" className="ml-2 text-sm text-gray-700">DD/MM/YYYY (e.g., 08/07/2025)</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" id="dateFormat3" name="dateFormat" className="h-4 w-4 text-primary-600 focus:ring-primary-500" />
                        <label htmlFor="dateFormat3" className="ml-2 text-sm text-gray-700">YYYY-MM-DD (e.g., 2025-07-08)</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Language</h3>
                    <select className="p-2 border border-gray-300 rounded-md w-full max-w-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Start of Week</h3>
                    <select className="p-2 border border-gray-300 rounded-md w-full max-w-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Monthly Summary</p>
                          <p className="text-xs text-gray-500">Receive a monthly summary of your financial activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Budget Alerts</p>
                          <p className="text-xs text-gray-500">Get notified when you're approaching budget limits</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Goal Progress</p>
                          <p className="text-xs text-gray-500">Receive updates on your financial goal progress</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Large Transactions</p>
                          <p className="text-xs text-gray-500">Get notified about unusually large transactions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Bill Reminders</p>
                          <p className="text-xs text-gray-500">Receive reminders for upcoming bills</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700">Enhance your account security with 2FA</p>
                      </div>
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Session Management</h3>
                    <p className="text-sm text-gray-700 mb-2">You're currently logged in on 1 device</p>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                      Manage Sessions
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Password</h3>
                    <p className="text-sm text-gray-700 mb-2">Last changed: 30 days ago</p>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border border-primary-500 rounded-md p-4 bg-white cursor-pointer">
                        <div className="h-20 bg-white border border-gray-200 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Light</p>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 cursor-pointer">
                        <div className="h-20 bg-gray-900 border border-gray-700 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">Dark</p>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 cursor-pointer">
                        <div className="h-20 bg-gradient-to-b from-white to-gray-900 border border-gray-200 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">System</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Dashboard Layout</h3>
                    <select className="p-2 border border-gray-300 rounded-md w-full max-w-xs focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="default">Default</option>
                      <option value="compact">Compact</option>
                      <option value="expanded">Expanded</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Integrations</h2>
                
                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                          🏦
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium">Bank Accounts</h3>
                          <p className="text-sm text-gray-500">Connect your bank accounts for automatic transaction import</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">
                          💳
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium">Credit Cards</h3>
                          <p className="text-sm text-gray-500">Link your credit cards to track expenses</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl">
                          📱
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium">Mobile App</h3>
                          <p className="text-sm text-gray-500">Sync with our mobile application</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Data Management</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Import Data</h3>
                    <p className="text-sm text-gray-700 mb-2">Import transactions from CSV or Excel files</p>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                      Import Data
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Export Data</h3>
                    <p className="text-sm text-gray-700 mb-2">Download your financial data</p>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                        Export as CSV
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                        Export as Excel
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-red-600">Danger Zone</h3>
                    <div className="border border-red-200 rounded-md p-4 bg-red-50">
                      <p className="text-sm text-gray-700 mb-4">
                        These actions are irreversible. Please proceed with caution.
                      </p>
                      <div className="space-y-2">
                        <button className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors w-full text-left">
                          Clear All Transaction Data
                        </button>
                        <button className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors w-full text-left">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3 px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
