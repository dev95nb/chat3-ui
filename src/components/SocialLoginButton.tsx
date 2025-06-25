import React from 'react';
import { Button, Loader } from '@mantine/core';
import { IconBrandGoogle, IconBrandFacebook, IconBrandApple } from '@tabler/icons-react';
import { SocialProvider } from '../types/auth';

// Định nghĩa cấu hình cho các nhà cung cấp xã hội
const providerConfig = {
  [SocialProvider.GOOGLE]: {
    name: 'Google',
    icon: <IconBrandGoogle size={20} />,
    variant: 'outline',
    color: 'gray',
  },
  [SocialProvider.FACEBOOK]: {
    name: 'Facebook',
    icon: <IconBrandFacebook size={20} />,
    variant: 'filled',
    color: 'blue',
  },
  [SocialProvider.APPLE]: {
    name: 'Apple',
    icon: <IconBrandApple size={20} />,
    variant: 'filled',
    color: 'dark',
  },
};

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  mode?: 'login' | 'register';
  size?: 'default' | 'sm' | 'lg';
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  provider,
  onClick,
  className = '',
  disabled = false,
  loading = false,
  mode = 'login',
  size = 'default',
}) => {
  const config = providerConfig[provider];

  if (!config) {
    console.warn(`Nhà cung cấp xã hội không được hỗ trợ: ${provider}`);
    return null;
  }

  const { name, icon, variant, color } = config;

  // Ánh xạ kích thước từ shadcn sang Mantine
  const sizeMap = {
    default: 'md',
    sm: 'sm',
    lg: 'lg',
  };

  // Tạo văn bản nút dựa trên trạng thái và mode
  const getButtonText = () => {
    if (loading) {
      return mode === 'register' ? 'Đang đăng ký...' : 'Đang đăng nhập...';
    }
    const action = mode === 'register' ? 'Đăng ký' : 'Đăng nhập';
    return `${action} với ${name}`;
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      size={sizeMap[size]}
      variant={variant}
      color={color}
      leftSection={loading ? <Loader size="sm" /> : icon}
      aria-label={`${mode === 'register' ? 'Đăng ký' : 'Đăng nhập'} với ${name}`}
      className={className}
    >
      {getButtonText()}
    </Button>
  );
};

export default SocialLoginButton;