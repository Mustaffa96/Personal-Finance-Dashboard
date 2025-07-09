import { CurrencyType } from '@/context/SettingsContext';

// Type for formatted currency with separate whole and decimal parts
export interface FormattedCurrencyParts {
  wholePartWithSymbol: string;
  decimalPart: string;
}

// Default currency for the application
export const DEFAULT_CURRENCY = 'MYR';

/**
 * Currency to locale mapping
 */
export const CURRENCY_LOCALE_MAP: Record<string, string> = {
  'USD': 'en-US',
  'MYR': 'ms-MY',
  'EUR': 'de-DE',
  'GBP': 'en-GB',
  'SGD': 'en-SG'
};

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: MYR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: CurrencyType = DEFAULT_CURRENCY as CurrencyType): string => {
  return new Intl.NumberFormat(CURRENCY_LOCALE_MAP[currency] || 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date to a readable string
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Format a date to a short string (MM/DD/YYYY)
 * @param date - The date to format
 * @returns Formatted date string
 */
export const formatShortDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
};

/**
 * Format a number as currency with separate whole and decimal parts
 * @param amount - The amount to format
 * @param currency - The currency code (default: MYR)
 * @returns Object with whole part (including currency symbol) and decimal part
 */
export const formatCurrencyWithParts = (amount: number, currency: CurrencyType = DEFAULT_CURRENCY as CurrencyType): FormattedCurrencyParts => {
  const formatted = formatCurrency(amount, currency);
  
  // Split the formatted string at the decimal point
  const parts = formatted.split('.');
  
  return {
    wholePartWithSymbol: parts[0],
    decimalPart: parts.length > 1 ? `.${parts[1]}` : '.00'
  };
};
