// Google OAuth2 Configuration
interface GoogleOAuthConfig {
    clientId: string;
    redirectUri: string;
    scope: string;
    responseType: string;
  }
  
  interface GoogleAuthResponse {
    access_token: string;
    id_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
  }
  
  interface GoogleUserInfo {
    id: string;
    email: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
  }
  
  // Google OAuth2 Service Class
  export class GoogleOAuthService {
    private config: Omit<GoogleOAuthConfig, 'redirectUri'>;
    private popup: Window | null = null;
  
    constructor() {
      this.config = {
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        scope: 'openid email profile',
        responseType: 'token',
      };
  
      if (!this.config.clientId) {
        throw new Error('Google Client ID is not configured');
      }
    }
  
    /**
     * Get redirect URI dynamically to avoid SSR issues
     */
    private getRedirectUri(): string {
      if (typeof window !== 'undefined') {
        return `${window.location.origin}/oauth2/google`;
      }
      // Fallback for SSR - use environment variable if available
      return process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/callback/google';
    }
  
    /**
     * Generate Google OAuth2 authorization URL
     */
    private generateAuthUrl(): string {
      const params = new URLSearchParams({
        client_id: this.config.clientId,
        redirect_uri: this.getRedirectUri(),
        scope: this.config.scope,
        response_type: this.config.responseType,
        state: this.generateRandomState(),
      });
  
      return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
  
    /**
     * Generate random state for CSRF protection
     */
    private generateRandomState(): string {
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
  
    /**
     * Exchange authorization code for tokens
     */
    private async exchangeCodeForTokens(code: string): Promise<GoogleAuthResponse> {
      const tokenEndpoint = 'https://oauth2.googleapis.com/token';
      
      const body = new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.getRedirectUri(),
      });
  
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Token exchange failed: ${errorData.error_description || errorData.error}`);
      }
  
      return await response.json();
    }
  
    /**
     * Get user info from Google API
     */
    private async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
  
      return await response.json();
    }
  
    /**
     * Verify ID token structure (basic validation)
     */
    private verifyIdTokenStructure(idToken: string): boolean {
      try {
        const parts = idToken.split('.');
        if (parts.length !== 3) return false;
  
        const payload = JSON.parse(atob(parts[1]));
        
        // Basic validation
        return !!(
          payload.iss &&
          payload.aud &&
          payload.exp &&
          payload.iat &&
          payload.sub
        );
      } catch {
        return false;
      }
    }
  
    /**
     * Alternative redirect method (for mobile or when popup is blocked)
     */
    public loginWithRedirect(): void {
      const authUrl = this.generateAuthUrl();
      window.location.href = authUrl;
    }
  
    /**
     * Handle callback from redirect (call this on callback page)
     */
    public async handleCallback(): Promise<{
      idToken: string;
      accessToken: string;
      userInfo: GoogleUserInfo;
    }> {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
  
      if (error) {
        throw new Error(`Authentication error: ${error}`);
      }
  
      if (!code) {
        throw new Error('No authorization code received');
      }
  
      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(code);
      
      // Verify ID token structure
      if (!this.verifyIdTokenStructure(tokens.id_token)) {
        throw new Error('Invalid ID token received');
      }
  
      // Get user info
      const userInfo = await this.getUserInfo(tokens.access_token);
  
      return {
        idToken: tokens.id_token,
        accessToken: tokens.access_token,
        userInfo: userInfo,
      };
    }
  
    /**
     * Handle callback from implicit flow (access token in URL fragment)
     */
    public async handleImplicitCallback(): Promise<{
      accessToken: string;
      userInfo: GoogleUserInfo;
    }> {
      console.log('handleImplicitCallback called');
      console.log('Current URL:', window.location.href);
      console.log('Fragment:', window.location.hash);
  
      // Parse URL fragment parameters
      const fragment = window.location.hash.substring(1);
      console.log('Parsed fragment:', fragment);
      
      const params = new URLSearchParams(fragment);
      
      const accessToken = params.get('access_token');
      const error = params.get('error');
      const errorDescription = params.get('error_description');
  
      console.log('Access token found:', !!accessToken);
      console.log('Error found:', error);
  
      if (error) {
        throw new Error(`Authentication error: ${errorDescription || error}`);
      }
  
      if (!accessToken) {
        console.error('Fragment params:', Object.fromEntries(params.entries()));
        throw new Error('No access token received from Google');
      }
  
      try {
        // Get user info using access token
        console.log('Fetching user info with access token...');
        const userInfo = await this.getUserInfo(accessToken);
        console.log('User info received:', userInfo);
  
        // Clear the fragment from URL for security only after success
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log('Fragment cleared from URL');
  
        return {
          accessToken: accessToken,
          userInfo: userInfo,
        };
      } catch (error) {
        console.error('Error in handleImplicitCallback:', error);
        throw error;
      }
    }
  
    /**
     * Clean up popup if still open
     */
    public cleanup(): void {
      if (this.popup && !this.popup.closed) {
        this.popup.close();
      }
    }
  }
  
  // Export singleton instance
  export const googleAuth = new GoogleOAuthService(); 