"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Only import devtools in development
const ReactQueryDevtools = process.env.NODE_ENV === 'production'
  ? () => null // Return null component in production
  : dynamic(() => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools), {
      ssr: false, // No need to render devtools on server
    });

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
            // Improve initial loading performance
            refetchOnMount: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
