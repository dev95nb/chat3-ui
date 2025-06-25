'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { queryKeyFactory } from '../../utils/queryKeyFactory';
import type { UpdateUserRequest } from '../../types';

// Hook to update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) => 
      userService.updateUser(id, data),
    onSuccess: (updatedUser, { id }) => {
      // Update the user in cache
      queryClient.setQueryData(queryKeyFactory.users.detail(id), updatedUser);
      
      // Also update auth profile if it's the current user
      queryClient.invalidateQueries({ queryKey: queryKeyFactory.auth.profile() });
      
      // Invalidate users list to refresh it
      queryClient.invalidateQueries({ queryKey: queryKeyFactory.users.lists() });
    },
  });
} 