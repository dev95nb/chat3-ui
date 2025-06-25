import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/api/services/chatService";
import { queryKeyFactory } from "@/api/utils/queryKeyFactory";
import { Chat, ChatListResponse } from "@/api/types/chat";

export interface UpdateChatTitleParams {
  chatId: string;
  title: string;
}

// Định nghĩa kiểu dữ liệu cho infinite query data
interface InfiniteChatListResponse {
  pages: ChatListResponse[];
  pageParams: unknown[];
}

export function useUpdateChatTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, title }: UpdateChatTitleParams) => 
      chatService.updateChatTitle(chatId, { title }),
    onSuccess: (updatedChat: Chat, variables) => {
      // Cập nhật dữ liệu chat trong cache thay vì invalidate query
      
      // 1. Cập nhật chat detail nếu đang xem chat đó
      queryClient.setQueryData(
        queryKeyFactory.chat.detail(variables.chatId),
        updatedChat
      );
      
      // 2. Cập nhật chat trong danh sách chat (infinite query)
      queryClient.setQueriesData(
        { queryKey: queryKeyFactory.chat.history() },
        (oldData: InfiniteChatListResponse | undefined) => {
          if (!oldData || !oldData.pages) return oldData;
          
          // Cập nhật chat trong tất cả các pages
          const updatedPages = oldData.pages.map((page: ChatListResponse) => {
            const updatedChats = page.chats.map((chat) => {
              if (chat._id === variables.chatId) {
                return { ...chat, title: variables.title };
              }
              return chat;
            });
            
            return { ...page, chats: updatedChats };
          });
          
          return { ...oldData, pages: updatedPages };
        }
      );
    },
  });
} 