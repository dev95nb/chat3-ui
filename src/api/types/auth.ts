// Authentication API Types

export interface AuthVerifyRequest {
  idToken: string;
  provider: "google" | "facebook" | "apple";
  platform: "web" | "mobile";
  userInfo?: {
    id: string;
    email: string;
    name: string;
    picture: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthVerifyResponse {
  isNewUser: boolean;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: User;
  message?: string;
} 