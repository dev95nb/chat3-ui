import { apiClient } from '../apiClient';
import { API_ENDPOINTS } from '../config';
import { tokenStorage } from '../utils/tokenStorage';
import type { 
  AuthVerifyRequest, 
  AuthVerifyResponse, 
  User 
} from '../types';

// Interface for refresh token response
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Auth Service Class
export class AuthService {
  /**
   * Verify ID token with server
   */
  async verifyIdToken(request: AuthVerifyRequest): Promise<AuthVerifyResponse> {
    const response = await apiClient.post(API_ENDPOINTS.auth.verify, {
      json: request,
    }).json<AuthVerifyResponse>();
    
    // Store token after successful verification
    if (!response.tokens) {
      throw new Error('No tokens received from server');
    }
    tokenStorage.setTokens(response.tokens);
    return response;
  }

  /**
   * Refresh authentication tokens using refresh token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    if (tokenStorage.isTokenExpired(refreshToken)) {
      throw new Error('Refresh token has expired');
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.refresh, {
        json: { refreshToken },
      }).json<RefreshTokenResponse>();

      // Store new tokens
      tokenStorage.setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      return response;
    } catch (error) {
      // Clear tokens if refresh fails
      tokenStorage.clearAll();
      throw error;
    }
  }

  /**
   * Validate current authentication status
   */
  async validateAuth(): Promise<boolean> {
    const accessToken = tokenStorage.getAccessToken();

    // No access token - try to refresh
    if (!accessToken) {
      try {
        await this.refreshToken();
        return true;
      } catch {
        return false;
      }
    }

    // Access token expired - try to refresh
    if (tokenStorage.isAccessTokenExpired()) {
      try {
        await this.refreshToken();
        return true;
      } catch {
        return false;
      }
    }

    // Access token is valid
    return true;
  }

  /**
   * Logout user and invalidate token
   */
  async logout(): Promise<{ success: boolean }> {
    const token = tokenStorage.getAccessToken();
    
    try {
      if (token) {
        await apiClient.post(API_ENDPOINTS.auth.logout, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Log error but don't throw - we still want to clear local storage
      console.warn('Server logout failed:', error);
    } finally {
      // Always clear local storage
      tokenStorage.clearAll();
    }

    return { success: true };
  }

  /**
   * Get user profile information
   */
  async getUserProfile(): Promise<User> {
    const response = await apiClient.get(API_ENDPOINTS.auth.profile).json<{ user: User }>();
    return response.user;
  }
}

// Export singleton instance
export const authService = new AuthService(); 