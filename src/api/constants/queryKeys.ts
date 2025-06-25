// Query key constants
export const QUERY_KEYS = {
  AUTH: 'auth',
  USERS: 'users',
  PROFILE: 'profile',
} as const;

// Query stale times (in milliseconds)
export const STALE_TIME = {
  SHORT: 1000 * 60, // 1 minute
  MEDIUM: 1000 * 60 * 5, // 5 minutes
  LONG: 1000 * 60 * 30, // 30 minutes
} as const;

// Cache times (in milliseconds)
export const CACHE_TIME = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 30, // 30 minutes
  LONG: 1000 * 60 * 60, // 1 hour
} as const; 