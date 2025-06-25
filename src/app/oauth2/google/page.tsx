"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Card,
  Stack,
  Loader,
  ThemeIcon,
  Title,
  Text,
  Alert,
  Button,
  rem,
} from "@mantine/core";
import { IconCheck, IconX, IconAlertCircle, IconLogin } from "@tabler/icons-react";

// Giả định các hàm/hook này vẫn tồn tại và hoạt động
import { googleAuth } from "@/utils/googleAuth";
import { useVerifyToken } from "@/api/hooks/auth";

interface AuthError {
  message: string;
  userMessage?: string;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const verifyTokenMutation = useVerifyToken();
  const hasExecuted = useRef(false);

  useEffect(() => {
    if (hasExecuted.current) return;
    hasExecuted.current = true;

    const handleAuthCallback = async () => {
      try {
        if (!window.location.hash.includes("access_token=")) {
          throw new Error("Không tìm thấy thông tin xác thực. Vui lòng thử đăng nhập lại.");
        }

        const { accessToken, userInfo } = await googleAuth.handleImplicitCallback();

        await verifyTokenMutation.mutateAsync({
          idToken: accessToken,
          provider: "google",
          platform: "web",
          userInfo: {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
          },
        });

        setTimeout(() => router.push("/"), 1500);
      } catch (error) {
        console.error("Lỗi xử lý callback xác thực:", error);
        setTimeout(() => router.push("/login"), 1500);
      }
    };

    handleAuthCallback();
  }, [router, verifyTokenMutation]);

  const { isPending, isSuccess, error } = verifyTokenMutation;
  const authError = error as AuthError | null;

  const renderStatus = () => {
    if (isPending || (!isSuccess && !authError)) {
      return (
        <Stack align="center" gap="lg">
          <ThemeIcon color="blue" size={rem(80)} radius="xl">
            <Loader size="xl" />
          </ThemeIcon>
          <Title order={3} ta="center">
            Đang xử lý xác thực...
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            Vui lòng đợi trong khi chúng tôi xác minh thông tin của bạn.
          </Text>
        </Stack>
      );
    }

    if (isSuccess) {
      return (
        <Stack align="center" gap="lg">
          <ThemeIcon color="teal" size={rem(80)} radius="xl">
            <IconCheck style={{ width: rem(40), height: rem(40) }} />
          </ThemeIcon>
          <Title order={3} ta="center">
            Đăng nhập thành công!
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            Đang chuyển hướng đến trang chính...
          </Text>
        </Stack>
      );
    }

    if (authError) {
      return (
        <Stack align="center" gap="lg">
          <ThemeIcon color="red" size={rem(80)} radius="xl">
            <IconX style={{ width: rem(40), height: rem(40) }} />
          </ThemeIcon>
          <Title order={3} ta="center">
            Xác thực thất bại
          </Title>
          <Alert variant="light" color="red" title="Đã xảy ra lỗi" icon={<IconAlertCircle />} w="100%">
            {authError.userMessage || authError.message || "Đã có lỗi xảy ra. Vui lòng thử lại."}
          </Alert>
          <Button
            onClick={() => router.push("/login")}
            color="red"
            fullWidth
            leftSection={<IconLogin size={rem(20)} />}
          >
            Quay lại trang đăng nhập
          </Button>
        </Stack>
      );
    }
  };

  return (
    <Container
      fluid
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--mantine-color-gray-0)",
      }}
    >
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        withBorder
        style={{ width: rem(400) }}
      >
        {renderStatus()}
      </Card>
    </Container>
  );
}