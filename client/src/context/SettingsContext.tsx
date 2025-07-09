'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the available currencies
export const AVAILABLE_CURRENCIES = ['MYR', 'USD', 'EUR', 'GBP', 'SGD'] as const;
export type CurrencyType = typeof AVAILABLE_CURRENCIES[number];

// Define the settings interface
interface Settings {
  currency: CurrencyType;
}

// Define the context interface
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

// Create the context with default values
const SettingsContext = createContext<SettingsContextType>({
  settings: {
    currency: 'MYR',
  },
  updateSettings: () => {},
});

// Hook to use the settings context
export const useSettings = () => useContext(SettingsContext);

// Provider component
export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Initialize settings from localStorage or use defaults
  const [settings, setSettings] = useState<Settings>({
    currency: 'MYR',
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('finance-dashboard-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        // Validate the currency value
        if (parsedSettings.currency && AVAILABLE_CURRENCIES.includes(parsedSettings.currency)) {
          setSettings(prevSettings => ({
            ...prevSettings,
            ...parsedSettings,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
  }, []);

  // Update settings function
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      
      // Save to localStorage
      try {
        localStorage.setItem('finance-dashboard-settings', JSON.stringify(updatedSettings));
      } catch (error) {
        console.error('Failed to save settings to localStorage:', error);
      }
      
      return updatedSettings;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
