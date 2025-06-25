// Query key factory for consistent key generation
export const queryKeyFactory = {
  // Auth keys
  auth: {
    all: ['auth'] as const,
    profile: () => [...queryKeyFactory.auth.all, 'profile'] as const,
  },

  // User keys
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeyFactory.users.all, 'list'] as const,
    list: (filters: Record<string, unknown> = {}) => 
      [...queryKeyFactory.users.lists(), filters] as const,
    details: () => [...queryKeyFactory.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeyFactory.users.details(), id] as const,
  },

  // Resource keys
  resource: {
    all: ['resource'] as const,
    list: (module: string) => [...queryKeyFactory.resource.all, module] as const,
  },

  // Chat keys
  chat: {
    all: ['chat'] as const,
    history: () => [...queryKeyFactory.chat.all, 'history'] as const,
    detail: (id: string) => [...queryKeyFactory.chat.all, 'detail', id] as const,
    messages: (chatId: string, params?: Record<string, unknown>) => 
      [...queryKeyFactory.chat.all, 'messages', chatId, params] as const,
  },
} as const; 