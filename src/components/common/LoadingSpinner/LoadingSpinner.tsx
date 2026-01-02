// src/components/common/LoadingSpinner/LoadingSpinner.tsx
/**
 * LoadingSpinner Component
 * Animated loading indicator with optional text
 */

import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Text from '../Text/Text';
import { useTheme } from '@/context/ThemeContext';

// ============================================================================
// TYPES
// ============================================================================

export type SpinnerSize = 'small' | 'large';

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: string;
  text?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
  overlay?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  text,
  fullScreen = false,
  style,
  overlay = false,
}) => {
  const { theme } = useTheme();

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  const spinnerColor = color || theme.colors.primary[500];

  // ==========================================================================
  // RENDER
  // ==========================================================================

  const content = (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        overlay && styles.overlay,
        style,
      ]}
    >
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && (
        <Text
          variant="body"
          color="secondary"
          align="center"
          style={styles.text}
        >
          {text}
        </Text>
      )}
    </View>
  );

  return content;
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  text: {
    marginTop: 12,
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default LoadingSpinner;
