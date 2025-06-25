import { useState, useEffect, useRef } from "react";
import useSSE, { ChatType } from "@/hooks/useSSE";
import { useChatById, useChatMessages } from "@/api/hooks/chat";
import type { Chat, Message, MessageContent } from "@/api/types/chat";
import { ContentType } from "@/api/types";

// A temporary type to handle the shape of chatDetail from the API more safely
interface ChatDetailWithInitMsg extends Chat {
  msgSent: boolean;
  initMsg: {
    contents: MessageContent[];
    isThinking: boolean;
  };
}

export interface MessageData {
  id: string;
  contents: MessageContent[];
  isThinking?: boolean;
  isBot: boolean;
  timestamp: Date;
}

export const useChatRoom = (
  chatId: string,
  setIsLoading: (loading: boolean) => void
) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const startMessageSentRef = useRef<boolean>(false);
  const currentChatIdRef = useRef<string>(chatId);

  const {
    sendMessage: sendSSEMessage,
    onMessage,
    cleanup,
  } = useSSE();
  const { data: chatDetail } = useChatById(chatId);
  const { data: messagesData, isLoading: messagesLoading } =
    useChatMessages(chatId);

  useEffect(() => {
    if (currentChatIdRef.current !== chatId) {
      startMessageSentRef.current = false;
      currentChatIdRef.current = chatId;
      setMessages([]);
    }
  }, [chatId]);

  useEffect(() => {
    if (messagesData?.messages) {
      const transformedMessages = messagesData.messages.map((msg: Message) => ({
        id: msg._id,
        contents: msg.contents,
        isBot: msg.isBot ?? false,
        timestamp: new Date(msg.createdAt),
      }));
      setMessages(transformedMessages);
    }
  }, [messagesData?.messages]);

  useEffect(() => {
    const cleanup = onMessage((data) => {
      if (data && data.chatId === chatId) {
        const messageChunk = data.message;

        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];

          if (lastMessage && lastMessage.isBot && lastMessage.id === data.id) {
            return prevMessages.map((msg, index) => {
              if (index === prevMessages.length - 1) {
                const newContent = [...msg.contents];
                const lastContentPart = newContent[newContent.length - 1];

                if (lastContentPart && lastContentPart.type === ContentType.TEXT) {
                  lastContentPart.content += messageChunk;
                } else {
                  newContent.push({
                    type: ContentType.TEXT,
                    content: messageChunk,
                  });
                }
                return { ...msg, content: newContent };
              }
              return msg;
            });
          } else {
            const botMessage: MessageData = {
              id: data.id,
              contents: messageChunk
                ? [{ type: ContentType.TEXT, content: messageChunk }]
                : [],
              isBot: true,
              timestamp: new Date(),
            };
            return [...prevMessages, botMessage];
          }
        });

        setIsLoading(false);
      }
    });

    return cleanup;
  }, [onMessage, chatId, setIsLoading]);

  useEffect(() => {
    if (
      chatDetail &&
      (chatDetail as ChatDetailWithInitMsg).msgSent === false &&
      (chatDetail as ChatDetailWithInitMsg).initMsg &&
      !startMessageSentRef.current &&
      !messagesLoading
    ) {
      startMessageSentRef.current = true;
      const initMsg = (chatDetail as ChatDetailWithInitMsg).initMsg;

      const userMessage: MessageData = {
        id: crypto.randomUUID(),
        contents: initMsg.contents,
        isThinking: initMsg.isThinking,
        isBot: false,
        timestamp: new Date(),
      };

      setMessages((prevMessages) =>
        prevMessages.length === 0
          ? [userMessage]
          : [...prevMessages, userMessage]
      );

      setIsLoading(true);

      try {
        sendSSEMessage(
          chatId,
          ChatType.CHAT,
          initMsg.contents,
          initMsg.isThinking
        );
      } catch (error) {
        console.error("Error sending initial message via SSE:", error);
        setIsLoading(false);
      }
    }
  }, [chatDetail, chatId, sendSSEMessage, messagesLoading, setIsLoading]);

  const sendMessage = (
    contents: MessageContent[],
    isThinking?: boolean
  ) => {
    const userMessage: MessageData = {
      id: crypto.randomUUID(),
      contents,
      isThinking,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      sendSSEMessage(chatId, ChatType.CHAT, contents, isThinking);
    } catch (error) {
      console.error("Error sending message via SSE:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup, chatId]);

  return {
    messages,
    sendMessage,
    messagesLoading,
  };
}; 