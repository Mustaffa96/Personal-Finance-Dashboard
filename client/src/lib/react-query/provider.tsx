"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { type ReactNode, useRef, useEffect, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';

// Create an isomorphic layout effect that works in both browser and SSR
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? 
  // Use useLayoutEffect in the browser
  useLayoutEffect : 
  // Fallback to useEffect during SSR
  useEffect;

// Only import devtools in development and lazy load it
const ReactQueryDevtools = process.env.NODE_ENV === 'production'
  ? () => null // Return null component in production
  : dynamic(() => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools), {
      ssr: false, // No need to render devtools on server
      loading: () => null, // Don't show loading state for devtools
    });

interface QueryProviderProps {
  children: ReactNode;
}

// Create a global cache key to persist data between page navigations
const GLOBAL_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Track if we're in the initial mount to optimize first load
let isInitialMount = true;

export function QueryProvider({ children }: QueryProviderProps) {
  // Use ref to avoid recreating the client during re-renders
  const queryClientRef = useRef<QueryClient | null>(null);
  
  // Track if this component is mounted
  const isMountedRef = useRef(false);
  
  // Initialize the client once on mount
  useIsomorphicLayoutEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    if (!queryClientRef.current) {
      queryClientRef.current = new QueryClient({
        // Set up query client with optimized settings
        queryCache: new QueryClient().getQueryCache(),
        defaultOptions: {
          queries: {
            staleTime: GLOBAL_CACHE_TIME,
            gcTime: GLOBAL_CACHE_TIME,
            refetchOnWindowFocus: false,
            retry: 1,
            refetchOnMount: isInitialMount ? 'always' : false, // Fetch on first mount only
            placeholderData: (previousData: unknown) => previousData,
            refetchOnReconnect: false,
            // Prioritize network requests for LCP data
            networkMode: 'always',
          },
        },
      });
      
      // Reset initial mount flag after first mount
      isInitialMount = false;
    }
  }, []);
  
  // Ensure we have a client before rendering
  if (!queryClientRef.current) {
    // Create a temporary client for SSR
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: GLOBAL_CACHE_TIME,
          gcTime: GLOBAL_CACHE_TIME, // Use gcTime instead of cacheTime for React Query v5
          refetchOnWindowFocus: false,
          retry: 1,
          // Improve initial loading performance
          refetchOnMount: isInitialMount ? 'always' : false, // Fetch on first mount only
          // Use placeholder data for faster initial render
          placeholderData: (previousData: unknown) => previousData,
          // Optimize network requests by preferring cached data
          refetchOnReconnect: false,
          // Set priority for network requests
          networkMode: 'always',
        },
      },
    });
  }

  // Use a memo to prevent unnecessary re-renders
  const memoizedClient = React.useMemo(() => queryClientRef.current as QueryClient, []);
  
  return (
    <QueryClientProvider client={memoizedClient}>
      {children}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
