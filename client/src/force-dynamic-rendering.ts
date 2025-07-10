/**
 * Utility to detect background tabs and optimize rendering
 * This helps improve LCP by prioritizing visible tabs
 */
export function forceDynamicRendering(): boolean {
  // Only run in browser
  if (typeof document === 'undefined') return false;
  
  // Check if the page is visible
  const isVisible = document.visibilityState === 'visible';
  
  // Check if the page is in the background
  const isHidden = document.hidden;
  
  // Return true if the page is visible and not hidden
  return isVisible && !isHidden;
}
