"use client"

import React, { useState } from 'react';
import { Flex, Paper, ScrollArea, Box, TextInput, Text, Button, Avatar, Group } from '@mantine/core';
import { IconMessage, IconChevronLeft, IconChevronRight, IconPlus, IconSearch, IconDotsVertical, IconUserCircle } from '@tabler/icons-react';

// Định nghĩa props cho Layout, bao gồm `children`
interface ChatLayoutProps {
    children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
    // State để quản lý việc đóng/mở sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Dữ liệu mẫu cho lịch sử chat (giữ lại trong layout vì nó là phần chung)
    const chatHistory = [
        { id: '1', title: 'Cuộc trò chuyện 1 Cuộc trò chuyện 1 Cuộc trò chuyện 1 Cuộc trò chuyện 1' },
        { id: '2', title: 'Cuộc trò chuyện 2' },
        { id: '3', title: 'Cuộc trò chuyện 3' },
        ...Array.from({ length: 20 }).map((_, index) => ({
            id: `${index + 4}`,
            title: `Cuộc trò chuyện ${index + 4}`,
        })),
    ];

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

                    {/* Chat History Section */}
                    <ScrollArea style={{ flex: 1 }}>
                        {chatHistory.map((chat) => (
                            <Box
                                key={chat.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 10px',
                                    borderBottom: '1px solid var(--mantine-color-gray-1)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'var(--mantine-color-gray-0)',
                                    },
                                }}
                            >
                                <Text truncate>{isSidebarOpen ? chat.title : ''}</Text>
                                {isSidebarOpen && <IconDotsVertical size={16} />}
                            </Box>
                        ))}
                    </ScrollArea>
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