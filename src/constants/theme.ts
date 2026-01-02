// src/constants/theme.ts
/**
 * Theme Configuration
 * Complete design system for MediQueue application
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary - Medical Teal
  primary: {
    50: '#E6F7F7',
    100: '#B3E5E5',
    200: '#80D4D4',
    300: '#4DC2C2',
    400: '#26B5B5',
    500: '#1A9999', // Main
    600: '#147A7A',
    700: '#0F5B5B',
    800: '#0A3D3D',
    900: '#051E1E',
  },

  // Secondary - Calming Purple
  secondary: {
    50: '#F5F7FF',
    100: '#E8ECFF',
    200: '#C7D1FF',
    300: '#9FB4FF',
    400: '#7894F5',
    500: '#667EEA', // Main
    600: '#5568CC',
    700: '#4A5FB8',
    800: '#3D4F99',
    900: '#2D3A70',
  },

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Background
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    disabled: '#D1D5DB',
  },

  // Border
  border: {
    light: '#F3F4F6',
    medium: '#E5E7EB',
    dark: '#D1D5DB',
  },

  // Status Colors
  status: {
    scheduled: '#3B82F6',
    confirmed: '#10B981',
    inProgress: '#F59E0B',
    completed: '#6B7280',
    cancelled: '#EF4444',
    noShow: '#DC2626',
  },

  // Queue Status Colors
  queue: {
    waiting: '#F59E0B',
    notified: '#F97316',
    onWay: '#3B82F6',
    arrived: '#10B981',
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontFamily: {
    heading: 'Nunito-Bold',
    headingLight: 'Nunito-Regular',
    body: 'Inter-Regular',
    bodyBold: 'Inter-SemiBold',
    bodyExtraBold: 'Inter-Bold',
    mono: 'RobotoMono-Regular',
  },

  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 10,
  },
} as const;

// ============================================================================
// DIMENSIONS
// ============================================================================

export const dimensions = {
  // Screen breakpoints
  breakpoints: {
    xs: 320,
    sm: 375,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  // Component sizes
  button: {
    xs: { height: 28, paddingHorizontal: 8 },
    sm: { height: 36, paddingHorizontal: 12 },
    md: { height: 44, paddingHorizontal: 16 },
    lg: { height: 52, paddingHorizontal: 24 },
    xl: { height: 60, paddingHorizontal: 32 },
  },

  input: {
    sm: { height: 36 },
    md: { height: 44 },
    lg: { height: 52 },
  },

  avatar: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
    '2xl': 120,
  },

  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },

  // Layout
  container: {
    maxWidth: 1200,
    padding: 16,
  },

  header: {
    height: 56,
  },

  tabBar: {
    height: 60,
  },

  modal: {
    sm: 300,
    md: 400,
    lg: 500,
    full: '90%',
  },
} as const;

// ============================================================================
// ANIMATIONS
// ============================================================================

export const animations = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },

  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },

  spring: {
    default: {
      damping: 15,
      stiffness: 150,
    },
    gentle: {
      damping: 20,
      stiffness: 100,
    },
    bouncy: {
      damping: 10,
      stiffness: 200,
    },
  },
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
} as const;

// ============================================================================
// OPACITY
// ============================================================================

export const opacity = {
  disabled: 0.5,
  hover: 0.8,
  pressed: 0.6,
  overlay: 0.5,
} as const;

// ============================================================================
// MAIN THEME OBJECT
// ============================================================================

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  dimensions,
  animations,
  zIndex,
  opacity,
} as const;

// ============================================================================
// DARK THEME (FOR FUTURE IMPLEMENTATION)
// ============================================================================

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: {
      primary: '#0F172A',
      secondary: '#1E293B',
      tertiary: '#334155',
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      tertiary: '#64748B',
      inverse: '#0F172A',
      disabled: '#475569',
    },
    border: {
      light: '#334155',
      medium: '#475569',
      dark: '#64748B',
    },
  },
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Theme = typeof theme | typeof darkTheme;
export type DarkTheme = typeof darkTheme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
export type Dimensions = typeof dimensions;
export type Animations = typeof animations;

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default theme;
