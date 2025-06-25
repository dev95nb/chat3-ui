// API configuration constants
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  retries: 3,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    verify: 'auth/verify',
    refresh: 'refresh-token',
    logout: 'auth/logout',
    profile: 'users/me',
  },
  user: {
    list: 'users',
    byId: (id: string) => `users/${id}`,
    update: (id: string) => `users/${id}`,
    delete: (id: string) => `users/${id}`,
  },
  resource: {
    list: 'resources',
  },
  chat: {
    history: 'chats',
    add: 'chats',
    getById: (id: string) => `chats/${id}`,
    delete: (id: string) => `chats/${id}`,
    update: (id: string) => `chats/${id}`,
    messages: (chatId: string) => `chats/${chatId}/messages`,
  },
} as const; 