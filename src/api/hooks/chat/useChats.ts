import { useQuery } from "@tanstack/react-query";
import { chatService } from "@/api/services/chatService";
import { queryKeyFactory } from "@/api/utils/queryKeyFactory";

interface UseChatParams {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}

export function useChats(params: UseChatParams = {}) {
  const { page = 1, limit = 50, search, enabled = true } = params;

  return useQuery({
    queryKey: queryKeyFactory.chat.history(),
    queryFn: () => chatService.getChatHistory({ page, limit, search }),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
} 