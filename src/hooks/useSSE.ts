import { useRef, useCallback } from "react";
import { EventSourcePlus } from "event-source-plus";
import { API_CONFIG } from "@/api/config";
import { tokenStorage } from "@/api/utils/tokenStorage";
import { MessageContent } from '@/api/types';

export interface SSEController {
  abort: () => void;
  onAbort: (callback: () => void) => void;
  reconnect: () => void;
}

export enum ChatType {
  CHAT = 'chat',
}

export interface SSEMessage {
  chatId: string;
  id: string;
  message: string;
}

/**
 * Hook for Server-Sent Events using event-source-plus
 * Replaces socket.io with SSE for chat messaging
 */
const useSSE = () => {
  const eventSourceRef = useRef<EventSourcePlus | null>(null);
  const controllerRef = useRef<SSEController | null>(null);
  const onMessageCallbackRef = useRef<((data: SSEMessage) => void) | null>(null);

  // Function to get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      throw new Error("Access token missing");
    }
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  // Send message function - creates new SSE connection
  const sendMessage = useCallback((
    chatId: string, 
    chatType: ChatType, 
    contents: MessageContent[], 
    isThinking?: boolean
  ) => {
    try {
      // Close existing connection if any
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }

      const headers = getAuthHeaders();
      const baseUrl = API_CONFIG.baseUrl?.replace(/\/$/, '') || '';
      
      // Create new EventSource with POST method and message data
      const eventSource = new EventSourcePlus(`${baseUrl}/sse?chatType=${chatType}`, {
        method: "post",
        headers,
        body: JSON.stringify({ id: crypto.randomUUID(), chatId, contents, isThinking }),
        retryStrategy: "on-error", // Only retry on error, good for LLM applications
      });

      eventSourceRef.current = eventSource;

      // Start listening to SSE stream
      const controller = eventSource.listen({
        onMessage(data) {
          try {
            // Parse the SSE message data
            const parsedData = JSON.parse(data.data || data.toString());
            
            // Call the registered callback if available
            if (onMessageCallbackRef.current) {
              onMessageCallbackRef.current(parsedData);
            }
          } catch (error) {
            console.error("Error parsing SSE message:", error);
          }
        },
        onResponse({ response }) {
          console.log(`SSE Response status: ${response.status}`);
        },
        onResponseError({ response, error }) {
          console.error("SSE Response error:", response?.status, error);
        },
        onRequestError({ error }) {
          console.error("SSE Request error:", error);
        },
      });

      controllerRef.current = controller;

      return controller;
    } catch (error) {
      console.error("Error creating SSE connection:", error);
      throw error;
    }
  }, [getAuthHeaders]);

  // Function to register message callback (similar to socket 'on')
  const onMessage = useCallback((callback: (data: SSEMessage) => void) => {
    onMessageCallbackRef.current = callback;

    // Return cleanup function
    return () => {
      onMessageCallbackRef.current = null;
    };
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current = null;
    }
    onMessageCallbackRef.current = null;
  }, []);

  return {
    sendMessage,
    onMessage,
    cleanup,
  };
};

export default useSSE; 