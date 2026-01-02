// src/components/common/Input/Input.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// COMPONENT
// ============================================================================

const AnimatedView = Animated.createAnimatedComponent(View);

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  required = false,
  disabled = false,
  containerStyle,
  inputStyle,
  labelStyle,
  variant = 'outlined',
  size = 'md',
  secureTextEntry,
  onFocus,
  onBlur,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const focusAnim = useSharedValue(0);

  // ============================================================================
  // ANIMATIONS
  // ============================================================================

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusAnim.value = withTiming(0, { duration: 200 });
    onBlur?.(e);
  };

  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        focusAnim.value,
        [0, 1],
        [
          error ? theme.colors.error : theme.colors.primary[300],
          error ? theme.colors.error : theme.colors.primary[500],
        ]
      ),
    };
  });

  // ============================================================================
  // STYLES
  // ============================================================================

  const sizeStyles = {
    sm: {
      fontSize: theme.typography.fontSize.sm,
      height: 36,
      paddingHorizontal: theme.spacing[3],
    },
    md: {
      fontSize: theme.typography.fontSize.base,
      height: 44,
      paddingHorizontal: theme.spacing[4],
    },
    lg: {
      fontSize: theme.typography.fontSize.lg,
      height: 52,
      paddingHorizontal: theme.spacing[5],
    },
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginBottom: theme.spacing[4],
    };

    return baseStyle;
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: theme.borderRadius.base,
    };

    const variantStyles: Record<string, ViewStyle> = {
      outlined: {
        borderWidth: 1.5,
        borderColor: error
          ? theme.colors.error
          : isFocused
          ? theme.colors.primary[500]
          : theme.colors.primary[300],
        backgroundColor: theme.colors.background.primary,
      },
      filled: {
        backgroundColor: theme.colors.background.secondary,
        borderBottomWidth: 2,
        borderBottomColor: error
          ? theme.colors.error
          : isFocused
          ? theme.colors.primary[500]
          : theme.colors.primary[300],
      },
      underlined: {
        borderBottomWidth: 2,
        borderBottomColor: error
          ? theme.colors.error
          : isFocused
          ? theme.colors.primary[500]
          : theme.colors.primary[300],
        borderRadius: 0,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...(disabled && {
        backgroundColor: theme.colors.background.tertiary,
        opacity: 0.6,
      }),
    };
  };

  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      ...sizeStyles[size],
      fontFamily: theme.typography.fontFamily.body,
      color: theme.colors.text.primary,
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.bodyBold,
      color: error
        ? theme.colors.error
        : isFocused
        ? theme.colors.primary[500]
        : theme.colors.text.secondary,
      marginBottom: theme.spacing[2],
    };
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {/* Label */}
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* Input Container */}
      <AnimatedView
        style={[
          getInputContainerStyle(),
          variant === 'outlined' && animatedBorderStyle,
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}

        {/* Text Input */}
        <TextInput
          {...props}
          style={[getInputStyle(), inputStyle]}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !showPassword}
          placeholderTextColor={theme.colors.text.tertiary}
          selectionColor={theme.colors.primary[500]}
        />

        {/* Right Icon or Password Toggle */}
        {(rightIcon || secureTextEntry) && (
          <View style={styles.iconContainer}>
            {secureTextEntry ? (
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.passwordToggle}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            ) : (
              rightIcon
            )}
          </View>
        )}
      </AnimatedView>

      {/* Error or Helper Text */}
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            error ? styles.errorText : styles.normalHelperText,
            { color: error ? theme.colors.error : theme.colors.text.secondary },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  required: {
    color: '#EF4444',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    fontWeight: '500',
  },
  normalHelperText: {
    fontWeight: '400',
  },
  passwordToggle: {
    fontSize: 20,
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default Input;
