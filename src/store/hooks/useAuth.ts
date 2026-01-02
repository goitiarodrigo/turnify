// src/store/hooks/useAuth.ts
/**
 * Authentication Hook and Store
 * Manages authentication state and operations using Zustand
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '@/services/AuthService';
import type { User, LoginCredentials, RegisterData } from '@/types/models';

// ============================================================================
// TYPES
// ============================================================================

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  socialLogin: (provider: 'google' | 'apple' | 'facebook', idToken: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
  initialize: () => Promise<void>;
}

// ============================================================================
// AUTH STORE
// ============================================================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: false,
      isLoading: false,
      error: null,

      // =======================================================================
      // LOGIN
      // =======================================================================

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const authData = await AuthService.login(credentials);
          
          set({
            user: authData.user,
            token: authData.token,
            isAuthenticated: true,
            isGuest: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Login failed',
          });
          throw error;
        }
      },

      // =======================================================================
      // REGISTER
      // =======================================================================

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const authData = await AuthService.register(data);
          
          set({
            user: authData.user,
            token: authData.token,
            isAuthenticated: true,
            isGuest: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Registration failed',
          });
          throw error;
        }
      },

      // =======================================================================
      // SOCIAL LOGIN
      // =======================================================================

      socialLogin: async (
        provider: 'google' | 'apple' | 'facebook',
        idToken: string
      ) => {
        set({ isLoading: true, error: null });
        
        try {
          const authData = await AuthService.socialLogin({
            provider,
            idToken,
            role: 'patient',
          });
          
          set({
            user: authData.user,
            token: authData.token,
            isAuthenticated: true,
            isGuest: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Social login failed',
          });
          throw error;
        }
      },

      // =======================================================================
      // GUEST MODE
      // =======================================================================

      continueAsGuest: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await AuthService.continueAsGuest();
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isGuest: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to continue as guest',
          });
          throw error;
        }
      },

      // =======================================================================
      // LOGOUT
      // =======================================================================

      logout: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await AuthService.logout();
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isGuest: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          // Even if logout fails, clear local state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isGuest: false,
            isLoading: false,
            error: null,
          });
        }
      },

      // =======================================================================
      // REFRESH USER
      // =======================================================================

      refreshUser: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await AuthService.getCurrentUser();
          
          set({
            user,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to refresh user',
          });
          throw error;
        }
      },

      // =======================================================================
      // UPDATE USER
      // =======================================================================

      updateUser: (user: User) => {
        set({ user });
        AuthService.updateUser(user);
      },

      // =======================================================================
      // CLEAR ERROR
      // =======================================================================

      clearError: () => {
        set({ error: null });
      },

      // =======================================================================
      // INITIALIZE
      // =======================================================================

      initialize: async () => {
        set({ isLoading: true });
        
        try {
          // Check if user is authenticated
          const isAuthenticated = await AuthService.isAuthenticated();
          const isGuest = await AuthService.isGuestMode();
          
          if (isAuthenticated) {
            // Get stored user data
            const user = await AuthService.getUser();
            const token = await AuthService.getToken();
            
            set({
              user,
              token,
              isAuthenticated: true,
              isGuest: false,
              isLoading: false,
            });

            // Refresh user data from API in background
            try {
              const freshUser = await AuthService.getCurrentUser();
              set({ user: freshUser });
            } catch (error) {
              // If refresh fails, keep stored user data
              console.warn('Failed to refresh user data:', error);
            }
          } else if (isGuest) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isGuest: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isGuest: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isGuest: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist essential state
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
      }),
    }
  )
);

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Main auth hook - provides all auth state and actions
 */
export const useAuth = () => {
  return useAuthStore();
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  return useAuthStore((state) => state.isAuthenticated);
};

/**
 * Hook to get current user
 */
export const useCurrentUser = () => {
  return useAuthStore((state) => state.user);
};

/**
 * Hook to check user role
 */
export const useUserRole = () => {
  return useAuthStore((state) => state.user?.role);
};

/**
 * Hook to check if user is guest
 */
export const useIsGuest = () => {
  return useAuthStore((state) => state.isGuest);
};

/**
 * Hook for auth loading state
 */
export const useAuthLoading = () => {
  return useAuthStore((state) => state.isLoading);
};

/**
 * Hook for auth errors
 */
export const useAuthError = () => {
  return useAuthStore((state) => state.error);
};

/**
 * Hook to check if user has specific role
 */
export const useHasRole = (role: string | string[]) => {
  const userRole = useUserRole();
  
  if (!userRole) return false;
  
  if (Array.isArray(role)) {
    return role.includes(userRole);
  }
  
  return userRole === role;
};

/**
 * Hook to check if user is patient
 */
export const useIsPatient = () => {
  return useHasRole('patient');
};

/**
 * Hook to check if user is professional
 */
export const useIsProfessional = () => {
  return useHasRole('professional');
};

/**
 * Hook to check if user is admin
 */
export const useIsAdmin = () => {
  return useHasRole(['admin', 'superadmin']);
};

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Selector for auth actions only
 */
export const useAuthActions = () => {
  return useAuthStore((state) => ({
    login: state.login,
    register: state.register,
    socialLogin: state.socialLogin,
    continueAsGuest: state.continueAsGuest,
    logout: state.logout,
    refreshUser: state.refreshUser,
    updateUser: state.updateUser,
    clearError: state.clearError,
    initialize: state.initialize,
  }));
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useAuth;

export type { AuthState };
