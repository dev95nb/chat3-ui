// Chat Service API Types
import { LanguageCode } from '@/types/language';
import { User } from "./user";

export enum ContentType {
  TEXT = "text",
  FILE = "file",
}

export interface MessageContent {
  type: ContentType;
  content: string;
}

export interface Chat {
  _id: string;
  userId: string;
  title: string;
  initMsg: {
    contents: MessageContent[];
    isThinking: boolean;
  };
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatListResponse {
  chats: Chat[];
  total: number;
  page: number;
  limit: number;
}

export interface AddChatRequest {
  initMsg: {
    contents: MessageContent[];
    isThinking: boolean;
  };
  language: LanguageCode;
}

export interface UpdateChatTitleRequest {
  title: string;
}

// Message types
export interface Message {
  _id: string;
  chatId: string;
  sender: User;
  contents: MessageContent[];
  isEdited?: boolean;
  isBot?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
}