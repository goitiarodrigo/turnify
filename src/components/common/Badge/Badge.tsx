// src/components/common/Badge/Badge.tsx
/**
 * Badge Component
 * Display status badges, counters, and labels
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Text from '../Text/Text';
import { useTheme } from '@/context/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'rounded' | 'square' | 'pill';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  dot?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// ============================================================================
// COMPONENT
// ============================================================================

const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  shape = 'rounded',
  count,
  maxCount = 99,
  showZero = false,
  dot = false,
  children,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  // ==========================================================================
  // SIZE CONFIGURATION
  // ==========================================================================

  const sizeConfig = {
    sm: {
      height: 18,
      minWidth: 18,
      paddingHorizontal: 4,
      fontSize: theme.typography.fontSize.xs,
      dotSize: 8,
    },
    md: {
      height: 22,
      minWidth: 22,
      paddingHorizontal: 6,
      fontSize: theme.typography.fontSize.sm,
      dotSize: 10,
    },
    lg: {
      height: 28,
      minWidth: 28,
      paddingHorizontal: 8,
      fontSize: theme.typography.fontSize.base,
      dotSize: 12,
    },
  };

  const config = sizeConfig[size];

  // ==========================================================================
  // VARIANT COLORS
  // ==========================================================================

  const variantColors = {
    success: {
      backgroundColor: theme.colors.success,
      textColor: theme.colors.text.inverse,
    },
    warning: {
      backgroundColor: theme.colors.warning,
      textColor: theme.colors.text.primary,
    },
    error: {
      backgroundColor: theme.colors.error,
      textColor: theme.colors.text.inverse,
    },
    info: {
      backgroundColor: theme.colors.info,
      textColor: theme.colors.text.inverse,
    },
    neutral: {
      backgroundColor: theme.colors.text.tertiary,
      textColor: theme.colors.text.inverse,
    },
    primary: {
      backgroundColor: theme.colors.primary[500],
      textColor: theme.colors.text.inverse,
    },
  };

  const colors = variantColors[variant];

  // ==========================================================================
  // SHAPE CONFIGURATION
  // ==========================================================================

  const borderRadiusConfig = {
    rounded: theme.borderRadius.base,
    square: theme.borderRadius.sm,
    pill: 999,
  };

  // ==========================================================================
  // DISPLAY LOGIC
  // ==========================================================================

  // Don't render if count is 0 and showZero is false
  if (count !== undefined && count === 0 && !showZero) {
    return null;
  }

  // Format count display
  const getDisplayCount = (): string => {
    if (count === undefined) return '';
    if (count > maxCount) return `${maxCount}+`;
    return count.toString();
  };

  // ==========================================================================
  // STYLES
  // ==========================================================================

  const containerStyle: ViewStyle = {
    height: dot ? config.dotSize : config.height,
    minWidth: dot ? config.dotSize : config.minWidth,
    paddingHorizontal: dot ? 0 : config.paddingHorizontal,
    backgroundColor: colors.backgroundColor,
    borderRadius: dot ? config.dotSize / 2 : borderRadiusConfig[shape],
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  };

  const textStyleComputed: TextStyle = {
    fontSize: config.fontSize,
    color: colors.textColor,
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontWeight: theme.typography.fontWeight.semibold,
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <View
      style={[containerStyle, style]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={
        count !== undefined ? `${count} notifications` : undefined
      }
    >
      {!dot && (
        <Text style={[textStyleComputed, textStyle]}>
          {count !== undefined ? getDisplayCount() : children}
        </Text>
      )}
    </View>
  );
};

// ============================================================================
// STATUS BADGE COMPONENT
// ============================================================================

export type StatusBadgeType =
  | 'online'
  | 'offline'
  | 'busy'
  | 'away'
  | 'active'
  | 'inactive'
  | 'pending'
  | 'approved'
  | 'rejected';

interface StatusBadgeProps {
  status: StatusBadgeType;
  size?: BadgeSize;
  showLabel?: boolean;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
  style,
}) => {
  const statusConfig: Record<
    StatusBadgeType,
    { variant: BadgeVariant; label: string }
  > = {
    online: { variant: 'success', label: 'Online' },
    offline: { variant: 'neutral', label: 'Offline' },
    busy: { variant: 'error', label: 'Busy' },
    away: { variant: 'warning', label: 'Away' },
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'neutral', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    approved: { variant: 'success', label: 'Approved' },
    rejected: { variant: 'error', label: 'Rejected' },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      size={size}
      shape="pill"
      style={style}
      dot={!showLabel}
    >
      {showLabel && config.label}
    </Badge>
  );
};

// ============================================================================
// ICON BADGE COMPONENT
// ============================================================================

interface IconBadgeProps {
  icon: React.ReactNode;
  count?: number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
}

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  count,
  variant = 'error',
  size = 'sm',
  style,
}) => {
  return (
    <View style={[styles.iconBadgeContainer, style]}>
      {icon}
      {count !== undefined && count > 0 && (
        <View style={styles.iconBadgePosition}>
          <Badge variant={variant} size={size} count={count} shape="pill" />
        </View>
      )}
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  iconBadgeContainer: {
    position: 'relative',
  },
  iconBadgePosition: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default Badge;
