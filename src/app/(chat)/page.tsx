"use client"

import React, { useState } from 'react';
import { Flex, Box, Title, Text, Stack } from '@mantine/core';
import InputChat from '@/components/chatbot/Input';
import { useAddChat } from "@/api/hooks/chat";
import { useLanguageStore } from "@/stores/languageStore";
import { useUploadFile } from "@/api/hooks/uploader";
import { ContentType, MessageContent } from "@/api/types";
import { useRouter } from 'next/navigation';

export default function ChatHomePage() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Get selected language from store
  const { selectedLanguage } = useLanguageStore();

  // Add useAddChat hook
  const addChatMutation = useAddChat();
  const uploadFileMutation = useUploadFile();

  // Handle sending first message and redirect to chat room
  const handleSendMessage = async (
    content: string,
    files: File[],
    options?: { isThinking?: boolean }
  ) => {
    setIsLoading(true);

    try {
      const messageContent: MessageContent[] = [];

      if (files.length > 0) {
        const uploadPromises = files.map(file => uploadFileMutation.mutateAsync(file));
        const uploadResponses = await Promise.all(uploadPromises);

        uploadResponses.forEach(response => {
          if (response.url) {
            messageContent.push({
              type: ContentType.FILE,
              content: response.url,
            });
          }
        });
      }

      if (content) {
        messageContent.push({ type: ContentType.TEXT, content });
      }

      if (messageContent.length === 0) {
        setIsLoading(false);
        return;
      }

      const newChat = await addChatMutation.mutateAsync({
        initMsg: {
          contents: messageContent,
          isThinking: options?.isThinking || false,
        },
        language: selectedLanguage.code,
      });

      router.push(`/chat/${newChat._id}`);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    // Container chính của trang, sắp xếp các phần tử theo chiều dọc
    <Flex direction="column" style={{ height: '100%' }}>
      {/* 1. Header của trang */}
      <Box
        style={{
          height: 60,
          backgroundColor: 'var(--mantine-color-blue-0)', // Có thể thêm màu nền để phân biệt
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          borderBottom: '1px solid var(--mantine-color-gray-2)',
          flexShrink: 0, // Quan trọng: Ngăn header bị co lại khi nội dung lớn
        }}
      >
        <Text fw={500}>Chatbot</Text>
      </Box>

      {/* 2. Khu vực nội dung chính, được căn giữa */}
      <Flex
        justify="center" // Căn giữa theo chiều dọc
        align="center"   // Căn giữa theo chiều ngang
        style={{
          flex: 1,       // Quan trọng: Chiếm toàn bộ không gian còn lại
          padding: '16px',
        }}
      >
        <Stack align="center" gap="lg" style={{ maxWidth: 700, width: '100%' }}>
          <Title order={2} ta="center">
            Chào mừng đến với Chatbot
          </Title>
          <Text c="dimmed" ta="center">
            Bắt đầu một cuộc trò chuyện mới bằng cách nhập câu hỏi của bạn vào ô bên dưới.
          </Text>
          <InputChat
            onSendMessage={handleSendMessage}
            disabled={addChatMutation.isPending || uploadFileMutation.isPending || isLoading}
          />
        </Stack>
      </Flex>
    </Flex>
  );
}