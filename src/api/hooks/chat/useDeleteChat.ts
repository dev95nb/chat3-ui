import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/api/services/chatService";
import { queryKeyFactory } from "@/api/utils/queryKeyFactory";

export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => chatService.deleteChat(chatId),
    onSuccess: () => {
      // Invalidate and refetch chat history
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.chat.history(),
      });
    },
  });
} 