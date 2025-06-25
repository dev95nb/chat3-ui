import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../config";
import type { AddChatRequest, Chat, ChatListResponse, MessagesResponse, UpdateChatTitleRequest } from "../types/chat";

export class ChatService {
  async getChatHistory(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ChatListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);

    const url = `${API_ENDPOINTS.chat.history}?${searchParams.toString()}`;
    return apiClient.get(url).json<ChatListResponse>();
  }

  async addChat(data: AddChatRequest): Promise<Chat> {
    const response = await apiClient.post(API_ENDPOINTS.chat.add, {
      json: data,
    }).json<Chat>();
    return response;
  }

  async getChatById(id: string): Promise<Chat> {
    const response = await apiClient.get(API_ENDPOINTS.chat.getById(id)).json<Chat>();
    return response;
  }

  async getChatMessages(chatId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<MessagesResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const url = `${API_ENDPOINTS.chat.messages(chatId)}?${searchParams.toString()}`;
    return apiClient.get(url).json<MessagesResponse>();
  }

  async deleteChat(chatId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.chat.delete(chatId));
  }

  async updateChatTitle(chatId: string, data: UpdateChatTitleRequest): Promise<Chat> {
    const response = await apiClient.patch(API_ENDPOINTS.chat.update(chatId), {
      json: data,
    }).json<Chat>();
    return response;
  }
}

// Export singleton instance
export const chatService = new ChatService();
