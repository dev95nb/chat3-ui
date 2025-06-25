'use client';

import { useQuery } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { queryKeyFactory } from '../../utils/queryKeyFactory';
import { STALE_TIME } from '../../constants/queryKeys';

// Hook to get current user profile (alias for useUserProfile)
export function useUser() {
  return useQuery({
    queryKey: queryKeyFactory.auth.profile(),
    queryFn: () => authService.getUserProfile(),
    staleTime: STALE_TIME.MEDIUM,
  });
} 