// Common API Types

// Base API response structure
export interface BaseApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Error types
export interface ApiErrorResponse {
  success: boolean;
  error: string;
  message: string;
  statusCode: number;
}

// Custom API Error class
export class ApiError extends Error {
  public statusCode: number;
  public userMessage: string;

  constructor(error: string, userMessage: string, statusCode: number) {
    super(error);
    this.name = "ApiError";
    this.userMessage = userMessage;
    this.statusCode = statusCode;
  }
} 