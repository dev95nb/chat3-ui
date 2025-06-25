'use client';

import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { queryKeyFactory } from '../../utils/queryKeyFactory';
import { STALE_TIME } from '../../constants/queryKeys';

interface UseUsersListParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Hook to get users list with pagination
export function useUsersList(params: UseUsersListParams = {}) {
  const { page = 1, limit = 10, search } = params;
  
  return useQuery({
    queryKey: queryKeyFactory.users.list({ page, limit, search }),
    queryFn: () => userService.getUsers({ page, limit, search }),
    staleTime: STALE_TIME.SHORT, // Shorter stale time for lists
    placeholderData: (previousData) => previousData, // Keep previous data while loading new page
  });
} 