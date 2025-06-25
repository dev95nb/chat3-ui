"use client"

import React, { useState } from 'react';
import { Box, ScrollArea, Text, TextInput } from '@mantine/core';
import InputChat from '@/components/chatbot/Input';
import { useChatRoom } from '@/components/chatbot/hooks';
import { useUploadFile } from "@/api/hooks/uploader";
import { ContentType, MessageContent } from "@/api/types";
import Image from "next/image";
import { FileType, getFileTypeFromUrl } from '@/utils/fileUtils';
import MarkdownRenderer from '@/components/markdown';

export default function ChatDetailPage({ params }: { params: { chatId: string } }) {
    const [isLoading, setIsLoading] = useState(false);

    const { messages, sendMessage, messagesLoading } = useChatRoom(
        params.chatId,
        setIsLoading
    );

    const uploadFileMutation = useUploadFile();

    // Handle sending a new message
    const handleSendMessage = async (
        content: string,
        files: File[],
        options?: { isThinking?: boolean }
    ) => {
        setIsLoading(true);

        try {
            const messageContent: MessageContent[] = [];

            if (files.length > 0) {
                // We set loading state for the whole input, so we use the page's isLoading
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

            if (messageContent.length > 0) {
                sendMessage(messageContent, options?.isThinking);
            } else {
            }
        } catch (error) {
        } finally {
            // The useChatRoom hook will set isLoading to false after SSE response
            // But if there's an error before that, we need to reset it.
            if (uploadFileMutation.isError) {
                setIsLoading(false);
            }
        }
    };

    // Handle message copy
    const handleCopyMessage = (messageId: string) => {
        const message = messages.find((msg) => msg.id === messageId);
        if (message) {
            const textContent = message.contents
                .filter((c: MessageContent) => c.type === ContentType.TEXT)
                .map((c: MessageContent) => c.content)
                .join(" ");
            navigator.clipboard.writeText(textContent);
        }
    };

    // Handle message regeneration (placeholder)
    const handleRegenerateMessage = (messageId: string) => {
        console.log("Regenerating message:", messageId);
        // TODO: Implement regeneration via API
    };

    const isDisabled = isLoading || messagesLoading;

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
                                justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                                marginBottom: 8,
                            }}
                        >
                            <Box
                                style={{
                                    maxWidth: '60%',
                                    padding: '8px 12px',
                                    borderRadius: 8,
                                    backgroundColor:
                                        message.isBot
                                            ? 'var(--mantine-color-gray-1)'
                                            : 'var(--mantine-color-blue-1)',
                                }}
                            >
                                {message.contents.map((item, index) => {
                                    if (item.type === ContentType.FILE) {
                                        const fileType = getFileTypeFromUrl(item.content);
                                        if (fileType === FileType.IMAGE) {
                                            return (
                                                <Image
                                                    key={index}
                                                    src={item.content}
                                                    alt="Uploaded content"
                                                    width={400}
                                                    height={300}
                                                    className="rounded-md max-w-full h-auto"
                                                    style={{ objectFit: "contain" }}
                                                />
                                            );
                                        }
                                        if (fileType === FileType.DOCUMENT) {
                                            return (
                                                <div key={index}>{item.content}</div>
                                            );
                                        }
                                    }
                                    if (item.type === ContentType.TEXT) {
                                        return (
                                            <MarkdownRenderer key={index}>
                                                {item.content}
                                            </MarkdownRenderer>
                                        );
                                    }
                                    return null;
                                })}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </ScrollArea>

            {/* Input Area */}
            <Box style={{ maxWidth: '70%', width: '100%', margin: '0 auto', padding: '16px', flexShrink: 0 }}>
                <InputChat
                    onSendMessage={handleSendMessage}
                    disabled={isDisabled || uploadFileMutation.isPending}
                />
            </Box>
        </>
    );
}