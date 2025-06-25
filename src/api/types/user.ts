// User Management API Types

import { User } from './auth';

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateUserRequest {
  name?: string;
  picture?: string;
}

// Re-export User type for convenience
export type { User } from './auth'; 