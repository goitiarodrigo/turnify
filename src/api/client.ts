// src/api/client.ts
/**
 * API Client
 * Axios instance configured with interceptors for authentication and error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/endpoints';

// ============================================================================
// TYPES
// ============================================================================

interface QueuedRequest {
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEYS = {
  TOKEN: '@mediqueue:token',
  REFRESH_TOKEN: '@mediqueue:refresh_token',
  TENANT_ID: '@mediqueue:tenant_id',
} as const;

// ============================================================================
// API CLIENT INSTANCE
// ============================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ============================================================================
// REFRESH TOKEN LOGIC
// ============================================================================

let isRefreshing = false;
let refreshSubscribers: QueuedRequest[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
};

const onRefreshError = (error: any) => {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: QueuedRequest) => {
  refreshSubscribers.push(callback);
};

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get auth token
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Get tenant ID
      const tenantId = await AsyncStorage.getItem(STORAGE_KEYS.TENANT_ID);
      if (tenantId && config.headers) {
        config.headers['X-Tenant-ID'] = tenantId;
      }

      // Log request in development
      if (__DEV__) {
        console.log('📤 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
        });
      }

      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log error in development
    if (__DEV__) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          addRefreshSubscriber({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem(
          STORAGE_KEYS.REFRESH_TOKEN
        );

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { token, refreshToken: newRefreshToken } = response.data.data;

        // Store new tokens
        await AsyncStorage.multiSet([
          [STORAGE_KEYS.TOKEN, token],
          [STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken],
        ]);

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        // Notify all queued requests
        onRefreshed(token);
        isRefreshing = false;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        onRefreshError(refreshError);
        isRefreshing = false;

        // Clear stored tokens
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
        ]);

        // Redirect to login (this will be handled by navigation)
        // You can emit an event or use a navigation service here

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Set authentication token
 */
export const setAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Failed to set auth token:', error);
  }
};

/**
 * Set tenant ID
 */
export const setTenantId = async (tenantId: string) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TENANT_ID, tenantId);
  } catch (error) {
    console.error('Failed to set tenant ID:', error);
  }
};

/**
 * Clear authentication data
 */
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  } catch (error) {
    return false;
  }
};

// ============================================================================
// ERROR HANDLER
// ============================================================================

/**
 * Extract error message from API error
 * Returns a user-friendly error message
 */
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    const { data, status } = error.response;

    if (data?.error?.message) {
      return data.error.message;
    }

    // HTTP status code messages
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Unauthorized. Please login again.';
      case 403:
        return 'Access denied. You do not have permission.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'Conflict. The resource already exists.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  } else if (error.request) {
    // Request was made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Handle API error and show toast notification
 * This function extracts error message and displays it to the user
 */
export const handleApiErrorWithToast = async (error: any): Promise<void> => {
  const errorMessage = handleApiError(error);
  
  // Dynamically import NotificationService to avoid circular dependencies
  const NotificationService = (await import('@/services/NotificationService')).default;
  
  // Don't show toast for 401 (handled by interceptor)
  if (error.response?.status !== 401) {
    NotificationService.showError(errorMessage);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default apiClient;

export type { AxiosInstance, AxiosError, InternalAxiosRequestConfig };
