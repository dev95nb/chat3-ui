import { useInfiniteQuery } from "@tanstack/react-query";
import { chatService } from "@/api/services/chatService";
import { queryKeyFactory } from "@/api/utils/queryKeyFactory";
import type { ChatListResponse } from "@/api/types/chat";

interface UseInfiniteChatsParams {
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export function useInfiniteChats(params: UseInfiniteChatsParams = {}) {
  const { limit = 20, search, enabled = true } = params;

  return useInfiniteQuery<ChatListResponse, Error>({
    queryKey: queryKeyFactory.chat.history(),
    queryFn: ({ pageParam = 1 }) => 
      chatService.getChatHistory({ 
        page: pageParam as number, 
        limit, 
        search 
      }),
    enabled,
    getNextPageParam: (lastPage) => {
      // Calculate if there are more pages
      const hasMore = lastPage.page * lastPage.limit < lastPage.total;
      return hasMore ? lastPage.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    initialPageParam: 1,
  });
} 