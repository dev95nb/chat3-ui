import React from 'react';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ScrollArea, Box, Center, Group, Loader, Text } from '@mantine/core';

interface InfiniteScrollListProps<T> {
    items: T[];
    hasNextPage: boolean;
    isLoading: boolean;
    isInitialLoading?: boolean;
    onLoadMore: () => void;
    renderItem: (item: T, index: number, ref?: (node: HTMLElement | null) => void) => React.ReactNode;
    loadingComponent?: React.ReactNode;
    initialLoadingComponent?: React.ReactNode;
    endComponent?: React.ReactNode;
    emptyComponent?: React.ReactNode;
    scrollAreaProps?: React.ComponentProps<typeof ScrollArea>;
}

export function InfiniteScrollList<T>({
    items,
    hasNextPage,
    isLoading,
    isInitialLoading = false,
    onLoadMore,
    renderItem,
    loadingComponent,
    initialLoadingComponent,
    endComponent,
    emptyComponent,
    scrollAreaProps = {}
}: InfiniteScrollListProps<T>) {
    const { lastElementRef } = useInfiniteScroll(
        hasNextPage,
        isLoading,
        onLoadMore,
        { enabled: true }
    );

    const defaultLoadingComponent = (
        <Center py="md">
            <Group gap="xs">
                <Loader size="sm" color="blue" />
                <Text c="dimmed" fz="xs">
                    Đang tải thêm...
                </Text>
            </Group>
        </Center>
    );

    const defaultEndComponent = (
        <Center py="md">
            <Text c="dimmed" fz="xs">
                Đã tải hết dữ liệu
            </Text>
        </Center>
    );

    const defaultEmptyComponent = (
        <Center py="xl">
            <Text c="dimmed" fz="xs">
                Không có dữ liệu
            </Text>
        </Center>
    );

    const defaultInitialLoadingComponent = (
        <Center py="xl">
            <Group gap="xs">
                <Loader size="md" color="blue" />
                <Text c="dimmed" fz="sm">
                    Đang tải dữ liệu...
                </Text>
            </Group>
        </Center>
    );

    if (isInitialLoading && items.length === 0) {
        return (
            <ScrollArea {...scrollAreaProps}>
                {initialLoadingComponent || defaultInitialLoadingComponent}
            </ScrollArea>
        );
    }

    if (items.length === 0) {
        return <Box>{emptyComponent || defaultEmptyComponent}</Box>;
    }

    return (
        <ScrollArea {...scrollAreaProps} style={{ flex: 1 }}>
            <Box p="md">
                {items.map((item, index) => {
                    const isLastItem = index === items.length - 1;
                    return renderItem(item, index, isLastItem ? lastElementRef : undefined);
                })}
                {isLoading && (loadingComponent || defaultLoadingComponent)}
                {!hasNextPage && items.length > 0 && (endComponent || defaultEndComponent)}
            </Box>
        </ScrollArea>
    );
}

export default InfiniteScrollList;