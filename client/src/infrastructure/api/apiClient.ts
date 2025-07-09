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
  const { method, body, requiresAuth = true } = options;
  
  // Default headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add auth token if required
  if (requiresAuth) {
    const session = await getSession();
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
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
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const data = await response.json();
      
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
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError((error as Error).message || 'Network error', 500);
  }
};
