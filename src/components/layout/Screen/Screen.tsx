// src/components/layout/Screen/Screen.tsx
/**
 * Screen Component
 * Wrapper component for screens with SafeArea and common layout features
 */

import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';

// ============================================================================
// TYPES
// ============================================================================

export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  keyboardAware?: boolean;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

// ============================================================================
// COMPONENT
// ============================================================================

const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  loading = false,
  refreshing = false,
  onRefresh,
  keyboardAware = true,
  backgroundColor,
  statusBarStyle,
  edges = ['top', 'bottom'],
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = true,
  header,
  footer,
}) => {
  const { theme, isDark } = useTheme();

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  const bgColor = backgroundColor || theme.colors.background.primary;
  const defaultStatusBarStyle = statusBarStyle || (isDark ? 'light-content' : 'dark-content');

  // ==========================================================================
  // RENDER CONTENT
  // ==========================================================================

  const renderContent = () => {
    if (loading) {
      return (
        <View style={[styles.loadingContainer, { backgroundColor: bgColor }]}>
          <LoadingSpinner size="large" />
        </View>
      );
    }

    return (
      <>
        {header}
        {children}
        {footer}
      </>
    );
  };

  // ==========================================================================
  // SCROLLABLE CONTENT
  // ==========================================================================

  if (scrollable) {
    const content = (
      <ScrollView
        style={[styles.scrollView, { backgroundColor: bgColor }, style]}
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary[500]}
              colors={[theme.colors.primary[500]]}
            />
          ) : undefined
        }
        keyboardShouldPersistTaps="handled"
      >
        {renderContent()}
      </ScrollView>
    );

    if (keyboardAware) {
      return (
        <SafeAreaView
          style={[styles.container, { backgroundColor: bgColor }]}
          edges={edges}
        >
          <StatusBar barStyle={defaultStatusBarStyle} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            {content}
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: bgColor }]}
        edges={edges}
      >
        <StatusBar barStyle={defaultStatusBarStyle} />
        {content}
      </SafeAreaView>
    );
  }

  // ==========================================================================
  // NON-SCROLLABLE CONTENT
  // ==========================================================================

  const content = (
    <View style={[styles.content, { backgroundColor: bgColor }, style]}>
      {renderContent()}
    </View>
  );

  if (keyboardAware) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: bgColor }]}
        edges={edges}
      >
        <StatusBar barStyle={defaultStatusBarStyle} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bgColor }]}
      edges={edges}
    >
      <StatusBar barStyle={defaultStatusBarStyle} />
      {content}
    </SafeAreaView>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default Screen;
