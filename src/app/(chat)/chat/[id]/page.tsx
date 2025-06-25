"use client"

import React from 'react';
import { Box, ScrollArea, Text, TextInput } from '@mantine/core';

// Component nhận `params` từ URL, trong đó có `chatId`
export default function ChatDetailPage({ params }: { params: { chatId: string } }) {
    // Bạn có thể dùng params.chatId để fetch dữ liệu cho cuộc trò chuyện cụ thể
    // Ví dụ: const { data: messages } = useChat(params.chatId);

    // Dữ liệu mẫu
    const messages = [
        { id: '1', sender: 'bot', content: 'Xin chào! Đây là cuộc trò chuyện ' + params.chatId },
        { id: '2', sender: 'user', content: 'Chào bạn!' },
        ...Array.from({ length: 20 }).map((_, index) => ({
            id: `${index + 3}`,
            sender: index % 2 === 0 ? 'bot' : 'user',
            content: `Tin nhắn ${index + 3}`,
        })),
    ];

    return (
        <>
            {/* Main Header - Giờ có thể hiển thị tiêu đề động */}
            <Box
                style={{
                    height: 60,
                    backgroundColor: 'var(--mantine-color-blue-0)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    borderBottom: '1px solid var(--mantine-color-gray-2)',
                    flexShrink: 0,
                }}
            >
                {/* Sử dụng chatId từ URL */}
                <Text fw={500}>Cuộc trò chuyện {params.chatId}</Text>
            </Box>

            {/* Message Area */}
            <ScrollArea style={{ flex: 1 }}>
                <Box style={{ maxWidth: '70%', width: '100%', margin: '0 auto', padding: '16px' }}>
                    {messages.map((message) => (
                        <Box
                            key={message.id}
                            style={{
                                display: 'flex',
                                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                marginBottom: 8,
                            }}
                        >
                            <Box
                                style={{
                                    maxWidth: '60%',
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    backgroundColor:
                                        message.sender === 'user'
                                            ? 'var(--mantine-color-blue-1)'
                                            : 'var(--mantine-color-gray-1)',
                                }}
                            >
                                <Text>{message.content}</Text>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </ScrollArea>

            {/* Input Area */}
            <Box style={{ maxWidth: '70%', width: '100%', margin: '0 auto', padding: '16px', flexShrink: 0 }}>
                <TextInput placeholder="Nhập tin nhắn..." />
            </Box>
        </>
    );
}