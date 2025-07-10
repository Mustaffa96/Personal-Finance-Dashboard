import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type RequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
};

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = { method: 'GET', requiresAuth: true }
): Promise<T> => {
  // Add console logging for debugging
  console.log(`API Request: ${endpoint}`, options);
  const { method, body, requiresAuth = true } = options;
  
  // Default headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add auth token if required
  if (requiresAuth) {
    const session = await getSession();
    // Use type assertion for the session token
    const sessionWithToken = session as { accessToken?: string };
    if (session && sessionWithToken.accessToken) {
      headers['Authorization'] = `Bearer ${sessionWithToken.accessToken}`;
    }
  }
  
  // Build request options
  const requestOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };
  
  // Add body for non-GET requests
  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body);
  }
  
  // Create a timeout promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new ApiError('Request timeout', 408)), 10000); // 10 second timeout
  });

  try {
    // Race between the fetch and the timeout
    const response = await Promise.race([
      fetch(`${API_BASE_URL}${endpoint}`, requestOptions),
      timeoutPromise
    ]) as Response;
    
    // Log response status for debugging
    console.log(`API Response: ${endpoint}`, { status: response.status, ok: response.ok });
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const data = await response.json();
      
      // Log response data for debugging
      console.log(`API Data: ${endpoint}`, data);
      
      // Handle API errors
      if (!response.ok) {
        throw new ApiError(data.message || 'An error occurred', response.status);
      }
      
      return data as T;
    }
    
    // Handle non-JSON success responses
    if (!response.ok) {
      throw new ApiError('An error occurred', response.status);
    }
    
    return {} as T;
  } catch (error) {
    // Enhanced error logging
    console.error(`API Error: ${endpoint}`, error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    // More specific error handling
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('Network connection error. Please check your internet connection.', 503);
    }
    
    throw new ApiError((error as Error).message || 'Network error', 500);
  }
};
