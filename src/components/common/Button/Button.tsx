// src/components/common/Button/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loadingText?: string;
  hapticFeedback?: boolean;
  animatePress?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  style,
  textStyle,
  loadingText,
  hapticFeedback = true,
  animatePress = true,
  onPress,
  ...props
}) => {
  const { theme, isDark } = useTheme();
  const scale = useSharedValue(1);

  // ============================================================================
  // ANIMATIONS
  // ============================================================================

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (animatePress && !disabled && !loading) {
      scale.value = withSpring(0.95, {
        damping: 15,
        stiffness: 150,
      });
    }
  };

  const handlePressOut = () => {
    if (animatePress && !disabled && !loading) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    }
  };

  const handlePress = (e: any) => {
    if (disabled || loading) return;
    
    // Haptic feedback (iOS/Android)
    if (hapticFeedback) {
      // Note: You'll need to install react-native-haptic-feedback
      // HapticFeedback.trigger('impactLight');
    }
    
    onPress?.(e);
  };

  // ============================================================================
  // STYLES
  // ============================================================================

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.base,
      overflow: 'hidden',
    };

    // Size-specific styles
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      xs: {
        paddingHorizontal: theme.spacing[2],
        paddingVertical: theme.spacing[1],
        minHeight: 28,
      },
      sm: {
        paddingHorizontal: theme.spacing[3],
        paddingVertical: theme.spacing[2],
        minHeight: 36,
      },
      md: {
        paddingHorizontal: theme.spacing[4],
        paddingVertical: theme.spacing[3],
        minHeight: 44,
      },
      lg: {
        paddingHorizontal: theme.spacing[6],
        paddingVertical: theme.spacing[4],
        minHeight: 52,
      },
      xl: {
        paddingHorizontal: theme.spacing[8],
        paddingVertical: theme.spacing[5],
        minHeight: 60,
      },
    };

    // Variant-specific styles
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: theme.colors.primary[500],
        ...theme.shadows.base,
      },
      secondary: {
        backgroundColor: theme.colors.primary[100],
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.primary[500],
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: theme.colors.error,
        ...theme.shadows.base,
      },
      success: {
        backgroundColor: theme.colors.success,
        ...theme.shadows.base,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...(fullWidth && { width: '100%' }),
      ...(disabled && {
        opacity: 0.5,
        ...theme.shadows.sm,
      }),
    };
  };

  const getTextStyle = (): TextStyle => {
    const fontSizes: Record<ButtonSize, number> = {
      xs: theme.typography.fontSize.xs,
      sm: theme.typography.fontSize.sm,
      md: theme.typography.fontSize.base,
      lg: theme.typography.fontSize.lg,
      xl: theme.typography.fontSize.xl,
    };

    const baseTextStyle: TextStyle = {
      fontSize: fontSizes[size],
      fontFamily: theme.typography.fontFamily.bodyBold,
      textAlign: 'center',
    };

    const textColors: Record<ButtonVariant, string> = {
      primary: theme.colors.text.inverse,
      secondary: theme.colors.primary[700],
      outline: theme.colors.primary[500],
      ghost: theme.colors.primary[500],
      danger: theme.colors.text.inverse,
      success: theme.colors.text.inverse,
    };

    return {
      ...baseTextStyle,
      color: textColors[variant],
    };
  };

  const getLoadingColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'danger':
      case 'success':
        return theme.colors.text.inverse;
      case 'secondary':
        return theme.colors.primary[700];
      case 'outline':
      case 'ghost':
        return theme.colors.primary[500];
      default:
        return theme.colors.primary[500];
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <AnimatedTouchable
      {...props}
      style={[getButtonStyle(), animatedStyle, style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      accessibilityLabel={typeof children === 'string' ? children : undefined}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size={size === 'xs' || size === 'sm' ? 'small' : 'large'}
            color={getLoadingColor()}
          />
          {loadingText && (
            <Text style={[getTextStyle(), styles.loadingText, textStyle]}>
              {loadingText}
            </Text>
          )}
        </View>
      ) : (
        <>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          
          <Text style={[getTextStyle(), textStyle]}>
            {children}
          </Text>
          
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </>
      )}
    </AnimatedTouchable>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default Button;

// Re-export types
// export type { ButtonVariant, ButtonSize };
