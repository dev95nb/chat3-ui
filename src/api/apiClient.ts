import ky from 'ky';
import { API_CONFIG } from './config';
import { tokenStorage } from './utils/tokenStorage';

let refreshPromise: Promise<string | null> | null = null;

// List of public routes that don't require authentication
const PUBLIC_ROUTES = ['/auth/verify'];

/**
 * Interface for auth refresh response
 */
interface RefreshResponse {
  accessToken: string;
}

/**
 * Creates the API client with automatic token refresh
 */
export const createApiClient = () => {
  return ky.create({
    prefixUrl: API_CONFIG.baseUrl,
    timeout: API_CONFIG.timeout,
    retry: {
      limit: 0,
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
      beforeRequest: [
        async (request) => {
          // Get the path from the URL
          const url = new URL(request.url);
          const path = url.pathname;
          
          // Skip token attachment for public routes
          if (PUBLIC_ROUTES.includes(path)) {
            return;
          }
          
          if (tokenStorage.isAccessTokenExpired()) {
            const newToken = await refreshAccessToken();
            if (newToken) {
              request.headers.set('Authorization', `Bearer ${newToken}`);
            }
            return;
          }
          const accessToken = tokenStorage.getAccessToken();
          if (accessToken) {
            request.headers.set('Authorization', `Bearer ${accessToken}`);
          }
        },
      ],
      afterResponse: [
        async (request, _, response) => {
          if (response.status === 401) {
            // Get the path from the URL
            const url = new URL(request.url);
            const path = url.pathname;
            
            // Skip token refresh for public routes
            if (PUBLIC_ROUTES.includes(path)) {
              return response;
            }
            
            const newToken = await refreshAccessToken();
            
            if (newToken) {
              request.headers.set('Authorization', `Bearer ${newToken}`);
              return ky(request);
            }
          }
          
          return response;
        },
      ],
    },
  });
};

/**
 * Refreshes the access token using the refresh token
 * Uses a promise cache to prevent multiple refresh requests
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      
      if (!refreshToken) {
        return null;
      }
      
      const authClient = ky.create({
        prefixUrl: API_CONFIG.baseUrl,
        timeout: API_CONFIG.timeout,
      });
      
      const response = await authClient.post('refresh-token', {
        json: { refreshToken },
      }).json<RefreshResponse>();
      
      tokenStorage.setTokens({ 
        accessToken: response.accessToken, 
        refreshToken 
      });
      
      return response.accessToken;
    } catch (error) {
      console.error('Failed to refresh access token', error);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  
  return refreshPromise;
};

export const apiClient = createApiClient();