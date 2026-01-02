// src/contexts/ThemeContext.tsx
/**
 * Theme Context Provider
 * Manages app theme (light/dark mode) and provides theme values
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme as lightTheme, darkTheme } from '@/constants/theme';
import type { Theme } from '@/constants/theme';

// ============================================================================
// TYPES
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const THEME_STORAGE_KEY = '@mediqueue:theme_mode';

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // ==========================================================================
  // LOAD SAVED THEME PREFERENCE
  // ==========================================================================

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedMode) {
        setThemeModeState(savedMode as ThemeMode);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  // ==========================================================================
  // UPDATE DARK MODE WHEN THEME MODE OR SYSTEM CHANGES
  // ==========================================================================

  useEffect(() => {
    if (themeMode === 'auto') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  // ==========================================================================
  // SET THEME MODE
  // ==========================================================================

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // ==========================================================================
  // TOGGLE THEME
  // ==========================================================================

  const toggleTheme = () => {
    if (themeMode === 'auto') {
      setThemeMode('light');
    } else if (themeMode === 'light') {
      setThemeMode('dark');
    } else {
      setThemeMode('auto');
    }
  };

  // ==========================================================================
  // GET CURRENT THEME
  // ==========================================================================

  const getCurrentTheme = (): Theme => {
    return isDark ? darkTheme : lightTheme;
  };

  // ==========================================================================
  // CONTEXT VALUE
  // ==========================================================================

  const value: ThemeContextType = {
    theme: getCurrentTheme(),
    isDark,
    themeMode,
    setThemeMode,
    toggleTheme,
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  
  return context;
};

// ============================================================================
// ADDITIONAL HOOKS
// ============================================================================

/**
 * Hook to get only the theme object
 */
export const useThemeValues = () => {
  const { theme } = useTheme();
  return theme;
};

/**
 * Hook to get only the dark mode state
 */
export const useIsDarkMode = () => {
  const { isDark } = useTheme();
  return isDark;
};

/**
 * Hook to get only the theme mode
 */
export const useThemeMode = () => {
  const { themeMode } = useTheme();
  return themeMode;
};

/**
 * Hook to get theme colors
 */
export const useColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

/**
 * Hook to get theme spacing
 */
export const useSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

/**
 * Hook to get theme typography
 */
export const useTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ThemeProvider;
