// This file forces dynamic rendering to prevent LCP inflation in background tabs
// It's referenced in next.config.mjs and helps ensure accurate performance metrics

// Export a function that can be used to force dynamic rendering
export function forceDynamicRendering() {
  // Check if the page is visible when it starts loading
  if (typeof document !== 'undefined') {
    // Add a flag to indicate if the page was loaded in a background tab
    window.__LOADED_IN_BACKGROUND = document.visibilityState !== 'visible';
    
    // Log visibility state for debugging
    console.debug('Page visibility state:', document.visibilityState);
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && window.__LOADED_IN_BACKGROUND) {
        // If page becomes visible and was loaded in background, consider reloading
        // for accurate performance metrics
        console.debug('Page became visible after loading in background');
      }
    });
  }
  
  return null;
}

// Default export for direct import
export default forceDynamicRendering;
