// src/services/AuthService.ts
/**
 * Authentication Service
 * Handles all authentication-related operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@/api/client';
import type { User, LoginCredentials, RegisterData } from '@/types/models';
import type { ApiResponse } from '@/types/models';

// ============================================================================
// TYPES
// ============================================================================

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

interface SocialLoginParams {
  provider: 'google' | 'apple' | 'facebook';
  idToken: string;
  role?: 'patient';
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEYS = {
  TOKEN: '@mediqueue:token',
  REFRESH_TOKEN: '@mediqueue:refresh_token',
  USER: '@mediqueue:user',
  GUEST_MODE: '@mediqueue:guest_mode',
  BIOMETRIC_ENABLED: '@mediqueue:biometric_enabled',
} as const;

// ============================================================================
// AUTH SERVICE CLASS
// ============================================================================

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // ==========================================================================
  // LOGIN & REGISTRATION
  // ==========================================================================

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/login',
        credentials
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Login failed');
      }

      const authData = response.data.data;

      // Store tokens and user data
      await this.storeAuthData(authData);

      return authData;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/register',
        data
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Registration failed');
      }

      const authData = response.data.data;

      // Store tokens and user data
      await this.storeAuthData(authData);

      return authData;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Social login (Google, Apple, Facebook)
   */
  async socialLogin(params: SocialLoginParams): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        '/auth/social',
        params
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error?.message || 'Social login failed');
      }

      const authData = response.data.data;

      // Store tokens and user data
      await this.storeAuthData(authData);

      return authData;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Continue as guest
   */
  async continueAsGuest(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GUEST_MODE, 'true');
    } catch (error) {
      console.error('Failed to set guest mode:', error);
      throw error;
    }
  }

  // ==========================================================================
  // LOGOUT
  // ==========================================================================

  /**
   * Logout user and clear all stored data
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = await this.getRefreshToken();

      // Call logout API
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Clear all stored auth data
      await this.clearAuthData();
    }
  }

  // ==========================================================================
  // TOKEN MANAGEMENT
  // ==========================================================================

  /**
   * Get stored access token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  }

  /**
   * Get stored refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<ApiResponse<{
        token: string;
        refreshToken: string;
      }>>('/auth/refresh', { refreshToken });

      if (!response.data.success || !response.data.data) {
        throw new Error('Token refresh failed');
      }

      const { token, refreshToken: newRefreshToken } = response.data.data;

      // Store new tokens
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, token],
        [STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken],
      ]);

      return token;
    } catch (error: any) {
      // If refresh fails, user needs to login again
      await this.clearAuthData();
      throw this.handleAuthError(error);
    }
  }

  // ==========================================================================
  // USER DATA
  // ==========================================================================

  /**
   * Get stored user data
   */
  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  /**
   * Update stored user data
   */
  async updateUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  }

  /**
   * Get current user profile from API
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<{ user: User }>>(
        '/users/me'
      );

      if (!response.data.success || !response.data.data) {
        throw new Error('Failed to get user profile');
      }

      const user = response.data.data.user;

      // Update stored user data
      await this.updateUser(user);

      return user;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // ==========================================================================
  // PASSWORD MANAGEMENT
  // ==========================================================================

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse>(
        '/auth/forgot-password',
        { email }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.error?.message || 'Failed to send reset email'
        );
      }
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse>(
        '/auth/reset-password',
        { token, password }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.error?.message || 'Failed to reset password'
        );
      }
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Change password (when user is authenticated)
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse>(
        '/auth/change-password',
        {
          currentPassword,
          newPassword,
        }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.error?.message || 'Failed to change password'
        );
      }
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // ==========================================================================
  // AUTH STATE
  // ==========================================================================

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if user is in guest mode
   */
  async isGuestMode(): Promise<boolean> {
    try {
      const guestMode = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_MODE);
      return guestMode === 'true';
    } catch (error) {
      return false;
    }
  }

  // ==========================================================================
  // BIOMETRIC AUTHENTICATION
  // ==========================================================================

  /**
   * Enable biometric authentication
   */
  async enableBiometric(): Promise<void> {
    try {
      // Store flag indicating biometric is enabled
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');

      // Store credentials securely using react-native-keychain
      // Implementation depends on react-native-keychain
      // Example:
      // await Keychain.setGenericPassword('username', 'password');
    } catch (error) {
      console.error('Failed to enable biometric:', error);
      throw error;
    }
  }

  /**
   * Disable biometric authentication
   */
  async disableBiometric(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'false');
      
      // Remove stored credentials
      // await Keychain.resetGenericPassword();
    } catch (error) {
      console.error('Failed to disable biometric:', error);
      throw error;
    }
  }

  /**
   * Check if biometric is enabled
   */
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(
        STORAGE_KEYS.BIOMETRIC_ENABLED
      );
      return enabled === 'true';
    } catch (error) {
      return false;
    }
  }

  /**
   * Authenticate with biometric
   */
  async authenticateWithBiometric(): Promise<AuthResponse> {
    try {
      // Retrieve credentials from secure storage
      // const credentials = await Keychain.getGenericPassword();
      
      // if (!credentials) {
      //   throw new Error('No credentials found');
      // }

      // Login with stored credentials
      // return await this.login({
      //   email: credentials.username,
      //   password: credentials.password,
      // });

      throw new Error('Biometric authentication not implemented');
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // ==========================================================================
  // PRIVATE METHODS
  // ==========================================================================

  /**
   * Store authentication data
   */
  private async storeAuthData(authData: AuthResponse): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, authData.token],
        [STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken],
        [STORAGE_KEYS.USER, JSON.stringify(authData.user)],
      ]);

      // Clear guest mode
      await AsyncStorage.removeItem(STORAGE_KEYS.GUEST_MODE);
    } catch (error) {
      console.error('Failed to store auth data:', error);
      throw error;
    }
  }

  /**
   * Clear all authentication data
   */
  private async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
        STORAGE_KEYS.GUEST_MODE,
      ]);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      throw error;
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: any): Error {
    if (error.response?.data?.error) {
      return new Error(error.response.data.error.message);
    }
    
    if (error.response?.status === 401) {
      return new Error('Invalid credentials');
    }
    
    if (error.response?.status === 403) {
      return new Error('Access denied');
    }
    
    if (error.message) {
      return new Error(error.message);
    }
    
    return new Error('Authentication failed');
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default AuthService.getInstance();

export type { AuthResponse, SocialLoginParams };
