'use client';

import { useState, useEffect } from 'react';
import PortfolioDisclaimer from './PortfolioDisclaimer';

export default function DisclaimerWrapper({ children }: { children: React.ReactNode }) {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Check if the user has already seen the disclaimer
      const hasSeenDisclaimer = localStorage.getItem('hasSeenPortfolioDisclaimer');
      
      if (!hasSeenDisclaimer) {
        setShowDisclaimer(true);
      }
    }
  }, []);
  
  const handleCloseDisclaimer = () => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      // Set flag in localStorage so it doesn't show again for a day
      localStorage.setItem('hasSeenPortfolioDisclaimer', 'true');
      
      // Set expiry for 24 hours
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + 24);
      localStorage.setItem('disclaimerExpiry', expiryTime.toString());
    }
    
    setShowDisclaimer(false);
  };
  
  // Check for expiry and reset if needed
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const checkExpiryInterval = setInterval(() => {
      const expiryTimeStr = localStorage.getItem('disclaimerExpiry');
      
      if (expiryTimeStr) {
        const expiryTime = new Date(expiryTimeStr);
        const currentTime = new Date();
        
        if (currentTime > expiryTime) {
          // Reset disclaimer visibility after expiry
          localStorage.removeItem('hasSeenPortfolioDisclaimer');
          localStorage.removeItem('disclaimerExpiry');
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(checkExpiryInterval);
  }, []);
  
  return (
    <>
      {showDisclaimer && <PortfolioDisclaimer onClose={handleCloseDisclaimer} />}
      {children}
    </>
  );
}
