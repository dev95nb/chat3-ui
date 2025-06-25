'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { CACHE_TIME, STALE_TIME } from './constants/queryKeys';

interface QueryProviderProps {
  children: ReactNode;
}

// Create default query client configuration
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME.MEDIUM,
        gcTime: CACHE_TIME.MEDIUM,
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors except 429 (too many requests)
          if (error && typeof error === 'object' && 'statusCode' in error) {
            const statusCode = error.statusCode as number;
            if (statusCode >= 400 && statusCode < 500 && statusCode !== 429) {
              return false;
            }
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: (failureCount, error) => {
          // Don't retry mutations on 4xx errors
          if (error && typeof error === 'object' && 'statusCode' in error) {
            const statusCode = error.statusCode as number;
            if (statusCode >= 400 && statusCode < 500) {
              return false;
            }
          }
          return failureCount < 2;
        },
      },
    },
  });
};

export function QueryProvider({ children }: QueryProviderProps) {
  // Create query client instance with useState to ensure it's stable
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
} 