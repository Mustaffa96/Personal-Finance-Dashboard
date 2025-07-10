'use client';

import React from 'react';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaMoneyBillWave, 
  FaMinusCircle, 
  FaBalanceScale, 
  FaPiggyBank 
} from 'react-icons/fa';

// Create a single component that exports all icons
// This allows for better code splitting and lazy loading
const Icons = {
  ArrowUp: () => <FaArrowUp className="mr-1 h-3 w-3" />,
  ArrowDown: () => <FaArrowDown className="mr-1 h-3 w-3" />,
  MoneyBillWave: () => <FaMoneyBillWave className="h-5 w-5" />,
  MinusCircle: () => <FaMinusCircle className="h-5 w-5" />,
  BalanceScale: () => <FaBalanceScale className="h-5 w-5" />,
  PiggyBank: () => <FaPiggyBank className="h-5 w-5" />
};

export default Icons;
