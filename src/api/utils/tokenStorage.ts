// Token storage utility with improved structure and type safety
export const ACCESS_TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

// Types for better type safety
interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface TokenPayload {
  exp: number;
  [key: string]: unknown;
}

// Helper functions for better code organization
class StorageHelper {
  private static isServerSide(): boolean {
    return typeof window === 'undefined';
  }

  private static dispatchStorageEvent(key: string, newValue: string | null, oldValue: string | null): void {
    if (this.isServerSide()) return;
    
    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue,
      oldValue
    }));
  }

  static getItem(key: string): string | null {
    if (this.isServerSide()) return null;
    return localStorage.getItem(key);
  }

  static setItem(key: string, value: string): void {
    if (this.isServerSide()) return;
    
    const oldValue = localStorage.getItem(key);
    localStorage.setItem(key, value);
    this.dispatchStorageEvent(key, value, oldValue);
  }

  static removeItem(key: string): void {
    if (this.isServerSide()) return;
    
    const oldValue = localStorage.getItem(key);
    localStorage.removeItem(key);
    this.dispatchStorageEvent(key, null, oldValue);
  }

  static parseJwtPayload(token: string): TokenPayload | null {
    try {
      const base64Payload = token.split('.')[1];
      if (!base64Payload) return null;
      
      const decodedPayload = atob(base64Payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.warn('Failed to parse JWT token:', error);
      return null;
    }
  }
}

// Main token storage interface
export const tokenStorage = {
  // Get individual token
  getAccessToken(): string | null {
    return StorageHelper.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return StorageHelper.getItem(REFRESH_TOKEN_KEY);
  },

  // Get both tokens as a pair
  getTokenPair(): TokenPair | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return null;
    }

    return { accessToken, refreshToken };
  },

  // Set both tokens at once
  setTokens(tokens: TokenPair): void {
    StorageHelper.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    StorageHelper.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  },

  // Set individual tokens
  setAccessToken(token: string): void {
    StorageHelper.setItem(ACCESS_TOKEN_KEY, token);
  },

  setRefreshToken(token: string): void {
    StorageHelper.setItem(REFRESH_TOKEN_KEY, token);
  },

  // Remove tokens
  removeAccessToken(): void {
    StorageHelper.removeItem(ACCESS_TOKEN_KEY);
  },

  removeRefreshToken(): void {
    StorageHelper.removeItem(REFRESH_TOKEN_KEY);
  },

  // Clear all tokens
  clearAll(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  },

  // Check if tokens exist
  hasAccessToken(): boolean {
    return this.getAccessToken() !== null;
  },

  hasRefreshToken(): boolean {
    return this.getRefreshToken() !== null;
  },

  hasValidTokenPair(): boolean {
    return this.hasAccessToken() && this.hasRefreshToken();
  },

  // Token expiration checks
  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getAccessToken();
    if (!tokenToCheck) return true;

    const payload = StorageHelper.parseJwtPayload(tokenToCheck);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  },

  isAccessTokenExpired(): boolean {
    const accessToken = this.getAccessToken();
    return this.isTokenExpired(accessToken || undefined);
  },

  isRefreshTokenExpired(): boolean {
    const refreshToken = this.getRefreshToken();
    return this.isTokenExpired(refreshToken || undefined);
  },

  // Get token expiration time
  getTokenExpirationTime(token?: string): Date | null {
    const tokenToCheck = token || this.getAccessToken();
    if (!tokenToCheck) return null;

    const payload = StorageHelper.parseJwtPayload(tokenToCheck);
    if (!payload || !payload.exp) return null;

    return new Date(payload.exp * 1000);
  },

  // Check if tokens need refresh (expire within next 5 minutes)
  needsRefresh(bufferMinutes: number = 5): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    const payload = StorageHelper.parseJwtPayload(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = bufferMinutes * 60;
    
    return payload.exp < (currentTime + bufferTime);
  }
}; 