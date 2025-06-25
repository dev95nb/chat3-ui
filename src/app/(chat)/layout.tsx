"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Paper, Box, Text, Button, Avatar, Group } from '@mantine/core';
import { IconMessage, IconChevronLeft, IconChevronRight, IconPlus, IconSearch, IconDotsVertical, IconUserCircle } from '@tabler/icons-react';
import { InfiniteScrollList } from '@/components/InfiniteScrollList';
import { useDeleteChat, useInfiniteChats, useUpdateChatTitle } from '@/api/hooks/chat';
import { ChatSession } from '@/types/chat';
import { useRouter } from 'next/navigation';

interface ChatLayoutProps {
    children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
    // State để quản lý việc đóng/mở sidebar
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [localChatSessions, setLocalChatSessions] = useState<ChatSession[]>([]);
    const {
        data: chatsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isInitialLoading,
    } = useInfiniteChats({ limit: 20 });

    const deleteChat = useDeleteChat();
    const updateChatTitle = useUpdateChatTitle();

    // Cập nhật local state khi dữ liệu từ API thay đổi
    useEffect(() => {
        if (chatsData?.pages) {
            const chatSessions = chatsData.pages.flatMap(page =>
                page.chats.map(chat => ({
                    id: chat._id,
                    title: chat.title || 'New Chat',
                    initMsg: chat.initMsg || '',
                    createdAt: new Date(chat.createdAt),
                    updatedAt: new Date(chat.updatedAt),
                    language: chat.language
                }))
            );
            setLocalChatSessions(chatSessions);
        }
    }, [chatsData]);


    const handleDeleteChat = useCallback((deleteChatId: string) => {
        deleteChat.mutate(deleteChatId, {
            onSuccess: () => {
                // Cập nhật local state sau khi xóa chat
                setLocalChatSessions(prev => prev.filter(chat => chat.id !== deleteChatId));

            },
            onError: (error: Error) => {
                console.error('Error deleting chat:', error);
            }
        });
    }, [router, deleteChat]);

    const handleRenameChat = useCallback((chatId: string, newTitle: string) => {
        // Cập nhật local state ngay lập tức để UI phản hồi nhanh
        setLocalChatSessions(prev =>
            prev.map(chat =>
                chat.id === chatId
                    ? { ...chat, title: newTitle }
                    : chat
            )
        );

        // Gọi API để cập nhật trên server
        updateChatTitle.mutate(
            { chatId, title: newTitle },
            {
                onError: (error: Error) => {
                    console.error('Error updating chat title:', error);
                    // Khôi phục lại dữ liệu cũ nếu có lỗi
                    if (chatsData?.pages) {
                        const chatSessions = chatsData.pages.flatMap(page =>
                            page.chats.map(chat => ({
                                id: chat._id,
                                title: chat.title || 'New Chat',
                                initMsg: chat.initMsg || '',
                                createdAt: new Date(chat.createdAt),
                                updatedAt: new Date(chat.updatedAt),
                                language: chat.language
                            }))
                        );
                        setLocalChatSessions(chatSessions);
                    }
                }
            }
        );
    }, [updateChatTitle, chatsData]);


    return (
        <Flex direction="row" style={{ height: '100vh' }}>
            {/* Sidebar (Phần chung không đổi) */}
            <Paper
                shadow="sm"
                p="md"
                style={{
                    width: isSidebarOpen ? 250 : 60,
                    height: '100%',
                    transition: 'width 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Sidebar Header */}
                <Box
                    style={{
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 10px',
                        borderBottom: '1px solid var(--mantine-color-gray-2)',
                        flexShrink: 0,
                    }}
                >
                    <IconMessage size={24} />
                    <Button
                        variant="subtle"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        style={{ padding: 0 }}
                    >
                        {isSidebarOpen ? <IconChevronLeft size={20} /> : <IconChevronRight size={20} />}
                    </Button>
                </Box>

                {/* Sidebar Body */}
                <Flex direction="column" style={{ flex: 1, overflow: 'hidden' }}>
                    {/* Buttons Section */}
                    <Box style={{ padding: '10px 0', flexShrink: 0 }}>
                        <Button
                            variant="light"
                            fullWidth
                            leftSection={<IconPlus size={20} />}
                            style={{ marginBottom: 8 }}
                        >
                            {isSidebarOpen && 'Tạo mới'}
                        </Button>
                        <Button
                            variant="light"
                            fullWidth
                            leftSection={<IconSearch size={20} />}
                        >
                            {isSidebarOpen && 'Tìm kiếm'}
                        </Button>
                    </Box>

                    <InfiniteScrollList
                        items={localChatSessions}
                        hasNextPage={hasNextPage}
                        isLoading={isFetchingNextPage}
                        isInitialLoading={isInitialLoading}
                        onLoadMore={() => {
                            if (hasNextPage) {
                                fetchNextPage();
                            }
                        }}
                        renderItem={(chat, index, ref) => {
                            return <Box
                                key={chat.id}
                                onClick={() => {
                                    router.push(`/chat/${chat.id}`);
                                }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Text truncate>{isSidebarOpen ? chat.title : ''}</Text>
                                {isSidebarOpen && <IconDotsVertical size={16} />}
                            </Box>;
                        }}
                    />
                </Flex>

                {/* Sidebar Footer */}
                <Box
                    style={{
                        height: 60,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 10px',
                        borderTop: '1px solid var(--mantine-color-gray-2)',
                        flexShrink: 0,
                    }}
                >
                    <Group gap={8}>
                        <Avatar size="sm" radius="xl">
                            <IconUserCircle size={20} />
                        </Avatar>
                        {isSidebarOpen && <Text truncate>Người dùng</Text>}
                    </Group>
                </Box>
            </Paper>

            {/* Main Area (Nội dung chính của trang sẽ được chèn vào đây) */}
            <Flex direction="column" flex={1}>
                {children}
            </Flex>
        </Flex>
    );
}