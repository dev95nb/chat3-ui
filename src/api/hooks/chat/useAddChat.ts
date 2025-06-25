import { chatService } from "@/api/services/chatService";
import { queryKeyFactory } from "@/api/utils/queryKeyFactory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddChatRequest } from "@/api/types";

export function useAddChat() {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: (data: AddChatRequest) => chatService.addChat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.chat.history(),
      });
    },
  });
}
