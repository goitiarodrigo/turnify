import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, User } from '@/types/models';
import { authAPI } from '@/api';

// Auth Slice
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isGuest: false,
      
      login: async (credentials) => {
        try {
          const response = await authAPI.login(credentials);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          });
          await AsyncStorage.setItem('auth_token', response.token);
        } catch (error) {
          throw error;
        }
      },
      
      logout: async () => {
        await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);