import {MessageContent} from './../api/types/chat'
export interface ChatSession {
  id: string;
  title: string;
  initMsg: string | { contents: MessageContent[]; isThinking: boolean };
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  contents: MessageContent[];
  role: 'user' | 'assistant';
  timestamp: Date;
} 