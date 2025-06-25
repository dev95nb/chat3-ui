"use client";

import React, { useState } from "react";
import {
    Card,
    Stack,
    Group,
    ActionIcon,
    Tooltip,
    FileButton,
    Badge,
    rem,
} from "@mantine/core";
import { IconArrowUp, IconX, IconPaperclip } from "@tabler/icons-react";
import LexicalEditor from "@/components/LexicalEditor";

const MAX_FILES = 5;
const ACCEPTED_FILE_TYPES = [
    "image/png", "image/jpeg", "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
];

interface InputChatProps {
    onSendMessage?: (message: string, files: File[]) => void;
    disabled?: boolean;
}

export default function InputChat({ onSendMessage, disabled = false }: InputChatProps) {
    const [message, setMessage] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // Đơn giản hóa hàm xử lý file từ Mantine FileButton
    const handleFileSelect = (files: File[]) => {
        const newFiles = [...selectedFiles, ...files];
        if (newFiles.length > MAX_FILES) {
            // Có thể thêm thông báo cho người dùng ở đây, ví dụ dùng Mantine Notifications
            console.warn(`Không thể chọn nhiều hơn ${MAX_FILES} tệp.`);
            setSelectedFiles(newFiles.slice(0, MAX_FILES)); // Chỉ lấy tối đa 5 tệp
        } else {
            setSelectedFiles(newFiles);
        }
    };

    const removeFile = (indexToRemove: number) => {
        setSelectedFiles((currentFiles) =>
            currentFiles.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleSend = () => {
        // Không cần biến canSend riêng, kiểm tra trực tiếp ở đây
        if ((message.trim() || selectedFiles.length > 0) && !disabled) {
            onSendMessage?.(message.trim(), selectedFiles);
            setMessage("");
            setSelectedFiles([]);
            // Logic reset LexicalEditor có thể cần xử lý riêng nếu cần
        }
    };

    const canSend = (message.trim().length > 0 || selectedFiles.length > 0) && !disabled;

    return (
        <Card withBorder radius="lg" p="xs" shadow="xl" w="100%" bg={'dark'}>
            <Stack gap="xs">
                {/* Khu vực hiển thị file đã chọn */}
                {selectedFiles.length > 0 && (
                    <Group p="xs" gap="xs" style={{ borderBottom: '1px solid var(--mantine-color-dark-4)' }}>
                        {selectedFiles.map((file, index) => (
                            <Badge
                                key={`${file.name}-${index}`}
                                variant="light"
                                pl={3}
                                rightSection={
                                    <ActionIcon
                                        size="xs"
                                        color="blue"
                                        radius="xl"
                                        variant="transparent"
                                        onClick={() => removeFile(index)}
                                    >
                                        <IconX style={{ width: rem(10), height: rem(10) }} />
                                    </ActionIcon>
                                }
                            >
                                {file.name}
                            </Badge>
                        ))}
                    </Group>
                )}

                {/* Editor */}
                <div style={{ padding: "var(--mantine-spacing-xs)" }}>
                    <LexicalEditor
                        value={message}
                        onChange={setMessage}
                        onEnter={handleSend}
                        placeholder="Bạn muốn hỏi điều gì?"
                    />
                </div>

                {/* Thanh công cụ */}
                <Group justify="space-between" align="center" mt="xs" px="xs">
                    <Tooltip label="Đính kèm tệp">
                        {/* Sử dụng FileButton của Mantine để đơn giản hóa */}
                        <FileButton
                            onChange={handleFileSelect}
                            accept={ACCEPTED_FILE_TYPES.join(',')}
                            multiple
                        >
                            {(props) => (
                                <ActionIcon {...props} variant="subtle" disabled={disabled}>
                                    <IconPaperclip size={18} />
                                </ActionIcon>
                            )}
                        </FileButton>
                    </Tooltip>

                    <Tooltip label="Gửi tin nhắn (Enter)">
                        <ActionIcon
                            color="blue"
                            variant="filled"
                            size="lg"
                            radius="xl"
                            onClick={handleSend}
                            disabled={!canSend}
                        >
                            <IconArrowUp size={20} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Stack>
        </Card>
    );
}