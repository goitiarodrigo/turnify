// src/components/common/Avatar/Avatar.tsx
/**
 * Avatar Component
 * Display user avatars with fallback initials and online status
 */

import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TouchableOpacity,
} from 'react-native';
import Text from '../Text/Text';
import { useTheme } from '@/context/ThemeContext';

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// ============================================================================
// TYPES
// ============================================================================

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarShape = 'circle' | 'rounded' | 'square';

export interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  showOnline?: boolean;
  isOnline?: boolean;
  badge?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  backgroundColor?: string;
  textColor?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'md',
  shape = 'circle',
  showOnline = false,
  isOnline = false,
  badge,
  onPress,
  style,
  backgroundColor,
  textColor,
}) => {
  const { theme } = useTheme();

  // ==========================================================================
  // SIZE CONFIGURATION
  // ==========================================================================

  const sizeConfig = {
    xs: {
      container: theme.dimensions.avatar.xs,
      fontSize: theme.typography.fontSize.xs,
      onlineSize: 8,
      badgeSize: 12,
    },
    sm: {
      container: theme.dimensions.avatar.sm,
      fontSize: theme.typography.fontSize.sm,
      onlineSize: 10,
      badgeSize: 16,
    },
    md: {
      container: theme.dimensions.avatar.md,
      fontSize: theme.typography.fontSize.base,
      onlineSize: 12,
      badgeSize: 20,
    },
    lg: {
      container: theme.dimensions.avatar.lg,
      fontSize: theme.typography.fontSize.lg,
      onlineSize: 14,
      badgeSize: 24,
    },
    xl: {
      container: theme.dimensions.avatar.xl,
      fontSize: theme.typography.fontSize.xl,
      onlineSize: 16,
      badgeSize: 28,
    },
    '2xl': {
      container: theme.dimensions.avatar['2xl'],
      fontSize: theme.typography.fontSize['2xl'],
      onlineSize: 20,
      badgeSize: 36,
    },
  };

  const config = sizeConfig[size];

  // ==========================================================================
  // SHAPE CONFIGURATION
  // ==========================================================================

  const borderRadiusConfig = {
    circle: config.container / 2,
    rounded: theme.borderRadius.lg,
    square: theme.borderRadius.sm,
  };

  // ==========================================================================
  // STYLES
  // ==========================================================================

  const containerStyle: ViewStyle = {
    width: config.container,
    height: config.container,
    borderRadius: borderRadiusConfig[shape],
    backgroundColor: backgroundColor || theme.colors.primary[200],
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const imageStyle: ImageStyle = {
    width: '100%',
    height: '100%',
  };

  const onlineIndicatorStyle: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: config.onlineSize,
    height: config.onlineSize,
    borderRadius: config.onlineSize / 2,
    backgroundColor: isOnline ? theme.colors.success : theme.colors.text.tertiary,
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  };

  const badgeContainerStyle: ViewStyle = {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: config.badgeSize,
    minHeight: config.badgeSize,
    borderRadius: config.badgeSize / 2,
    backgroundColor: theme.colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  };

  // ==========================================================================
  // CONTENT
  // ==========================================================================

  const renderContent = () => {
    if (uri) {
      return (
        <Image
          source={{ uri }}
          style={imageStyle}
          resizeMode="cover"
          accessibilityLabel={name ? `${name}'s avatar` : 'User avatar'}
        />
      );
    }

    // Fallback to initials
    const initials = name ? getInitials(name) : '?';
    return (
      <Text
        variant="bodyBold"
        color="primary"
        style={{
          fontSize: config.fontSize,
          color: textColor || theme.colors.primary[700],
        }}
      >
        {initials}
      </Text>
    );
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  const avatarContent = (
    <View style={[containerStyle, style]}>
      {renderContent()}

      {/* Online Indicator */}
      {showOnline && <View style={onlineIndicatorStyle} />}

      {/* Badge */}
      {badge && <View style={badgeContainerStyle}>{badge}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessible
        accessibilityRole="button"
        accessibilityLabel={name ? `${name}'s avatar` : 'User avatar'}
      >
        {avatarContent}
      </TouchableOpacity>
    );
  }

  return avatarContent;
};

// ============================================================================
// AVATAR GROUP COMPONENT
// ============================================================================

interface AvatarGroupProps {
  avatars: Array<{
    uri?: string | null;
    name?: string;
  }>;
  size?: AvatarSize;
  max?: number;
  spacing?: number;
  onPressMore?: () => void;
  style?: ViewStyle;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 'md',
  max = 3,
  spacing = -8,
  onPressMore,
  style,
}) => {
  const { theme } = useTheme();
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const sizeConfig = {
    xs: theme.dimensions.avatar.xs,
    sm: theme.dimensions.avatar.sm,
    md: theme.dimensions.avatar.md,
    lg: theme.dimensions.avatar.lg,
    xl: theme.dimensions.avatar.xl,
    '2xl': theme.dimensions.avatar['2xl'],
  };

  return (
    <View style={[styles.groupContainer, style]}>
      {displayAvatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.groupAvatar,
            {
              marginLeft: index > 0 ? spacing : 0,
              zIndex: displayAvatars.length - index,
            },
          ]}
        >
          <Avatar
            uri={avatar.uri}
            name={avatar.name}
            size={size}
            style={{
              borderWidth: 2,
              borderColor: theme.colors.background.primary,
            }}
          />
        </View>
      ))}

      {/* Show remaining count */}
      {remaining > 0 && (
        <TouchableOpacity
          onPress={onPressMore}
          style={[
            styles.groupAvatar,
            {
              marginLeft: spacing,
              zIndex: 0,
            },
          ]}
        >
          <Avatar
            name={`+${remaining}`}
            size={size}
            backgroundColor={theme.colors.primary[300]}
            style={{
              borderWidth: 2,
              borderColor: theme.colors.background.primary,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {
    // Position avatars overlapping
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export default Avatar;
