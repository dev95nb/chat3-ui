'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeyFactory } from '../../utils/queryKeyFactory';
import { STALE_TIME } from '../../constants/queryKeys';
import { chatService } from '@/api/services/chatService';

// Hook to get messages by chat ID
export function useChatMessages(chatId: string, params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: queryKeyFactory.chat.messages(chatId, params),
    queryFn: () => chatService.getChatMessages(chatId, params),
    enabled: !!chatId,
    staleTime: STALE_TIME.SHORT,
  });
} 