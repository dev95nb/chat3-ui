'use client';

import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { queryKeyFactory } from '../../utils/queryKeyFactory';
import { STALE_TIME } from '../../constants/queryKeys';

// Hook to get user by ID
export function useUserById(id: string) {
  return useQuery({
    queryKey: queryKeyFactory.users.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    staleTime: STALE_TIME.MEDIUM,
  });
} 