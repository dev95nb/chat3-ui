'use client'

import React, { useState } from 'react';
import { Center, Paper, Stack, Box, Title, Text, Button, Anchor, Group } from '@mantine/core';
import { IconShield, IconBrandGoogle, IconBrandFacebook, IconBrandApple } from '@tabler/icons-react';
import Link from 'next/link';
import { googleAuth } from '@/utils/googleAuth';
import { SocialProvider } from '@/types/auth';
import SocialLoginButton from '@/components/SocialLoginButton';


function LoginPage() {
    const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);

    const handleSocialLogin = async (provider: SocialProvider) => {
        setLoadingProvider(provider);
        try {
            switch (provider) {
                case SocialProvider.GOOGLE:
                    googleAuth.loginWithRedirect();
                    break;
                case SocialProvider.FACEBOOK:
                    // Implement Facebook login
                    break;
                case SocialProvider.APPLE:
                    // Implement Apple login
                    break;
            }
            console.log(`Đăng nhập với ${provider}`);
        } catch (error) {
            console.error(`Đăng nhập ${provider} thất bại:`, error);
        } finally {
            setLoadingProvider(null);
        }
    };

    return (
        <Center style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-gray-0)' }}>
            <Paper
                shadow="lg"
                radius="xl"
                p="xl"
                style={{ maxWidth: 448, width: '100%' }}
                withBorder
            >
                <Stack align="center" gap="md">
                    <Box
                        w={64}
                        h={64}
                        bg="indigo.6"
                        display="flex"
                        style={{ alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        mb="md"
                    >
                        <IconShield size={32} color="white" />
                    </Box>
                    <Stack gap="sm" align="center">
                        <Title order={1} size="h1" c="gray.9">
                            Chào mừng trở lại
                        </Title>
                        <Text size="lg" c="gray.6">
                            Đăng nhập để tiếp tục hành trình
                        </Text>
                    </Stack>

                    <Stack gap="md" w="100%" mt="lg">
                        <SocialLoginButton
                            provider={SocialProvider.GOOGLE}
                            onClick={() => handleSocialLogin(SocialProvider.GOOGLE)}
                            loading={loadingProvider === SocialProvider.GOOGLE}
                            disabled={loadingProvider !== null}
                        />
                        <SocialLoginButton
                            provider={SocialProvider.FACEBOOK}
                            onClick={() => handleSocialLogin(SocialProvider.FACEBOOK)}
                            loading={loadingProvider === SocialProvider.FACEBOOK}
                            disabled={loadingProvider !== null}
                        />
                        <SocialLoginButton
                            provider={SocialProvider.APPLE}
                            onClick={() => handleSocialLogin(SocialProvider.APPLE)}
                            loading={loadingProvider === SocialProvider.APPLE}
                            disabled={loadingProvider !== null}
                        />
                    </Stack>
                </Stack>
            </Paper>
        </Center>
    );
}

export default LoginPage;