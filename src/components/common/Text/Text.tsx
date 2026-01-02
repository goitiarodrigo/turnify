// src/components/common/Text/Text.tsx
/**
 * Text Component
 * Custom text component with predefined styles and variants
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'bodyBold'
  | 'caption'
  | 'overline'
  | 'label';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface TextComponentProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  align?: TextAlign;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  mono?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
  capitalize?: boolean;
  numberOfLines?: number;
  selectable?: boolean;
  children: React.ReactNode;
}

// ============================================================================
// COMPONENT
// ============================================================================

const Text: React.FC<TextComponentProps> = ({
  variant = 'body',
  color = 'primary',
  align = 'left',
  bold = false,
  italic = false,
  underline = false,
  strikethrough = false,
  mono = false,
  uppercase = false,
  lowercase = false,
  capitalize = false,
  numberOfLines,
  selectable = false,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  // ==========================================================================
  // VARIANT STYLES
  // ==========================================================================

  const variantStyles = {
    h1: {
      fontSize: theme.typography.fontSize['4xl'],
      fontFamily: theme.typography.fontFamily.heading,
      lineHeight: theme.typography.fontSize['4xl'] * theme.typography.lineHeight.tight,
      fontWeight: theme.typography.fontWeight.bold,
    },
    h2: {
      fontSize: theme.typography.fontSize['3xl'],
      fontFamily: theme.typography.fontFamily.heading,
      lineHeight: theme.typography.fontSize['3xl'] * theme.typography.lineHeight.tight,
      fontWeight: theme.typography.fontWeight.bold,
    },
    h3: {
      fontSize: theme.typography.fontSize['2xl'],
      fontFamily: theme.typography.fontFamily.heading,
      lineHeight: theme.typography.fontSize['2xl'] * theme.typography.lineHeight.tight,
      fontWeight: theme.typography.fontWeight.bold,
    },
    h4: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.heading,
      lineHeight: theme.typography.fontSize.xl * theme.typography.lineHeight.normal,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    h5: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.heading,
      lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    h6: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.heading,
      lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    body: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.body,
      lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
      fontWeight: theme.typography.fontWeight.normal,
    },
    bodyBold: {
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.bodyBold,
      lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    caption: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.body,
      lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
      fontWeight: theme.typography.fontWeight.normal,
    },
    overline: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.body,
      lineHeight: theme.typography.fontSize.xs * theme.typography.lineHeight.normal,
      fontWeight: theme.typography.fontWeight.medium,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
    },
    label: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.bodyBold,
      lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
      fontWeight: theme.typography.fontWeight.medium,
    },
  };

  // ==========================================================================
  // COLOR STYLES
  // ==========================================================================

  const colorStyles = {
    primary: { color: theme.colors.text.primary },
    secondary: { color: theme.colors.text.secondary },
    tertiary: { color: theme.colors.text.tertiary },
    inverse: { color: theme.colors.text.inverse },
    success: { color: theme.colors.success },
    error: { color: theme.colors.error },
    warning: { color: theme.colors.warning },
    info: { color: theme.colors.info },
  };

  // ==========================================================================
  // COMPUTED STYLES
  // ==========================================================================

  const computedStyle = [
    variantStyles[variant],
    colorStyles[color],
    { textAlign: align },
    bold && { fontWeight: theme.typography.fontWeight.bold },
    italic && { fontStyle: 'italic' as const },
    underline && strikethrough
      ? { textDecorationLine: 'underline line-through' as const }
      : underline
      ? { textDecorationLine: 'underline' as const }
      : strikethrough
      ? { textDecorationLine: 'line-through' as const }
      : undefined,
    mono && { fontFamily: theme.typography.fontFamily.mono },
    uppercase && { textTransform: 'uppercase' as const },
    lowercase && { textTransform: 'lowercase' as const },
    capitalize && { textTransform: 'capitalize' as const },
    style,
  ];

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <RNText
      {...props}
      style={computedStyle}
      numberOfLines={numberOfLines}
      selectable={selectable}
      allowFontScaling
      accessible
      accessibilityRole="text"
    >
      {children}
    </RNText>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default Text;
