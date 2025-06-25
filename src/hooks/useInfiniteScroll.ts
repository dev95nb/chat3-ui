import { useCallback, useEffect, useRef } from 'react';

export interface InfiniteScrollConfig {
  threshold?: number; // Intersection observer threshold (0 to 1)
  rootMargin?: string; // Intersection observer root margin
  enabled?: boolean; // Enable/disable infinite scroll
}

export interface UseInfiniteScrollReturn {
  lastElementRef: (node: HTMLElement | null) => void;
  isLoading: boolean;
  hasNextPage: boolean;
  loadMore: () => void;
}

export function useInfiniteScroll(
  hasNextPage: boolean,
  isLoading: boolean,
  loadMore: () => void,
  config: InfiniteScrollConfig = {}
): UseInfiniteScrollReturn {
  const { threshold = 0.1, rootMargin = '0px', enabled = true } = config;
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (!enabled || isLoading) return;

      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create new observer
      if (node) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isLoading) {
              loadMore();
            }
          },
          { rootMargin, threshold }
        );
        observerRef.current.observe(node);
      }
    },
    [enabled, isLoading, hasNextPage, loadMore, rootMargin, threshold]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    lastElementRef,
    isLoading,
    hasNextPage,
    loadMore,
  };
}