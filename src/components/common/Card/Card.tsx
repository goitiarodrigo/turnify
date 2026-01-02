// src/components/common/Card/Card.tsx
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================

export type CardVariant = 'flat' | 'elevated' | 'outlined';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type CardBorderRadius = 'sm' | 'base' | 'lg' | 'xl' | '2xl';

export interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  borderRadius?: CardBorderRadius;
  onPress?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  animatePress?: boolean;
  backgroundColor?: string;
}

// ============================================================================
// MAIN CARD COMPONENT
// ============================================================================

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
  Divider: typeof CardDivider;
} = ({
  variant = 'elevated',
  padding = 'md',
  borderRadius = 'lg',
  onPress,
  disabled = false,
  children,
  style,
  animatePress = true,
  backgroundColor,
}) => {
  const { theme } = useTheme();
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
    if (animatePress && onPress && !disabled) {
      scale.value = withSpring(0.98, {
        damping: 15,
        stiffness: 150,
      });
    }
  };

  const handlePressOut = () => {
    if (animatePress && onPress && !disabled) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    }
  };

  // ============================================================================
  // STYLES
  // ============================================================================

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius[borderRadius],
      overflow: 'hidden',
      backgroundColor: backgroundColor || theme.colors.background.primary,
    };

    // Padding styles
    const paddingStyles: Record<CardPadding, ViewStyle> = {
      none: { padding: 0 },
      sm: { padding: theme.spacing[2] },
      md: { padding: theme.spacing[4] },
      lg: { padding: theme.spacing[6] },
      xl: { padding: theme.spacing[8] },
    };

    // Variant styles
    const variantStyles: Record<CardVariant, ViewStyle> = {
      flat: {
        backgroundColor: backgroundColor || theme.colors.background.secondary,
      },
      elevated: {
        ...theme.shadows.base,
      },
      outlined: {
        borderWidth: 1,
        borderColor: theme.colors.primary[200],
      },
    };

    return {
      ...baseStyle,
      ...paddingStyles[padding],
      ...variantStyles[variant],
      ...(disabled && {
        opacity: 0.6,
      }),
    };
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={[getCardStyle(), animatedStyle, style]}
        accessibilityRole="button"
      >
        {children}
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedView style={[getCardStyle(), style]}>
      {children}
    </AnimatedView>
  );
};

// ============================================================================
// CARD HEADER SUB-COMPONENT
// ============================================================================

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          marginBottom: theme.spacing[3],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ============================================================================
// CARD CONTENT SUB-COMPONENT
// ============================================================================

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  spacing?: 'sm' | 'md' | 'lg';
}

const CardContent: React.FC<CardContentProps> = ({
  children,
  style,
  spacing = 'md',
}) => {
  const { theme } = useTheme();

  const spacingValue = {
    sm: theme.spacing[2],
    md: theme.spacing[4],
    lg: theme.spacing[6],
  };

  return (
    <View
      style={[
        {
          gap: spacingValue[spacing],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ============================================================================
// CARD FOOTER SUB-COMPONENT
// ============================================================================

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
}

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  style,
  justify = 'flex-end',
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: justify,
          marginTop: theme.spacing[3],
          gap: theme.spacing[2],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// ============================================================================
// CARD DIVIDER SUB-COMPONENT
// ============================================================================

interface CardDividerProps {
  style?: ViewStyle;
  color?: string;
  thickness?: number;
  marginVertical?: number;
}

const CardDivider: React.FC<CardDividerProps> = ({
  style,
  color,
  thickness = 1,
  marginVertical,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: color || theme.colors.primary[200],
          marginVertical: marginVertical || theme.spacing[3],
        },
        style,
      ]}
    />
  );
};

// ============================================================================
// ATTACH SUB-COMPONENTS
// ============================================================================

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Divider = CardDivider;

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  // Add any additional shared styles here if needed
});

// ============================================================================
// EXPORTS
// ============================================================================

export default Card;


