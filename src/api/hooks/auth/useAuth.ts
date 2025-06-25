'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { queryKeyFactory } from '../../utils/queryKeyFactory';
import { tokenStorage } from '../../utils/tokenStorage';
import { STALE_TIME, QUERY_KEYS } from '../../constants/queryKeys';
import type { AuthVerifyRequest } from '../../types';

/**
 * Hook to verify authentication token
 */
export function useVerifyToken() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: AuthVerifyRequest) => authService.verifyIdToken(request),
    onSuccess: () => {
      // Invalidate and refetch user profile after successful login
      queryClient.invalidateQueries({ queryKey: queryKeyFactory.auth.all });
    },
  });
}

/**
 * Hook for validating authentication status
 */
export const useValidateAuth = () => {
  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH, 'validate'],
    mutationFn: () => authService.validateAuth(),
    retry: false, // Don't retry auth validation
  });
};

/**
 * Hook to refresh token
 */
export function useRefreshToken() {
  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH, 'refresh'],
    mutationFn: () => authService.refreshToken(),
    retry: false, // Don't retry token refresh
    onError: () => {
      // If refresh fails, clear token and redirect to login
      tokenStorage.removeAccessToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });
}

/**
 * Hook to logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH, 'logout'],
    mutationFn: () => authService.logout(),
    retry: false, // Don't retry logout
    onSuccess: () => {
      // Clear all queries and redirect
      queryClient.clear();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });
}

/**
 * Hook to get user profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: queryKeyFactory.auth.profile(),
    queryFn: () => authService.getUserProfile(),
    enabled: tokenStorage.hasAccessToken(), // Only fetch if token exists
    staleTime: STALE_TIME.MEDIUM,
  });
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data: user, isLoading, error } = useUserProfile();
  
  return {
    isAuthenticated: !!user && !error,
    user,
    isLoading,
    error,
  };
} 