import { apiClient } from '../apiClient';
import { API_ENDPOINTS } from '../config';
import type { 
  User, 
  UserListResponse, 
  UpdateUserRequest 
} from '../types';

// User Service Class
export class UserService {
  /**
   * Get list of users with pagination
   */
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<UserListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);

    const url = `${API_ENDPOINTS.user.list}?${searchParams.toString()}`;
    return apiClient.get(url).json<UserListResponse>();
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(API_ENDPOINTS.user.byId(id)).json<{ user: User }>();
    return response.user;
  }

  /**
   * Update user profile
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put(API_ENDPOINTS.user.update(id), {
      json: data,
    }).json<{ user: User }>();
    return response.user;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<{ success: boolean }> {
    return apiClient.delete(API_ENDPOINTS.user.delete(id)).json<{ success: boolean }>();
  }
}

// Export singleton instance
export const userService = new UserService(); 