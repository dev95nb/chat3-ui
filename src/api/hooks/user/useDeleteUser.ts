'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { queryKeyFactory } from '../../utils/queryKeyFactory';

// Hook to delete user
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (_, deletedUserId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: queryKeyFactory.users.detail(deletedUserId) });
      
      // Invalidate users list to refresh it
      queryClient.invalidateQueries({ queryKey: queryKeyFactory.users.lists() });
    },
  });
} 