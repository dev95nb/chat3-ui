'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeyFactory } from '../../utils/queryKeyFactory';
import { STALE_TIME } from '../../constants/queryKeys';
import { chatService } from '@/api/services/chatService';

// Hook to get speak by ID
export function useChatById(id: string) {
  return useQuery({
    queryKey: queryKeyFactory.chat.detail(id),
    queryFn: () => chatService.getChatById(id),
    enabled: !!id,
    staleTime: STALE_TIME.MEDIUM,
  });
} 