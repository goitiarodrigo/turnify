// src/screens/patient/ProfileScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Card from '@/components/common/Card/Card';
import Avatar from '@/components/common/Avatar/Avatar';
import { useAuthStore } from '@/store/store';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user, logout } = useAuthStore();

  const handleEditProfile = () => {
    navigation.navigate('EditProfile' as any);
  };

  const handleSettings = () => {
    navigation.navigate('Settings' as any);
  };

  const handlePaymentMethods = () => {
    navigation.navigate('PaymentMethods' as any);
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications' as any);
  };

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      icon: '✏️',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: handleEditProfile,
    },
    {
      icon: '💳',
      title: 'Payment Methods',
      subtitle: 'Manage your payment cards',
      onPress: handlePaymentMethods,
    },
    {
      icon: '🔔',
      title: 'Notifications',
      subtitle: 'View all notifications',
      onPress: handleNotifications,
    },
    {
      icon: '⚙️',
      title: 'Settings',
      subtitle: 'App preferences and privacy',
      onPress: handleSettings,
    },
  ];

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Avatar
            uri={user?.avatar}
            name={user?.name || 'User'}
            size="xl"
          />
          <Text variant="h2" style={styles.name}>
            {user?.name || 'Guest User'}
          </Text>
          <Text variant="body" color="secondary">
            {user?.email || 'guest@turnify.com'}
          </Text>
          {user?.phone && (
            <Text variant="body" color="secondary">
              {user.phone}
            </Text>
          )}

          <Button
            variant="outline"
            size="sm"
            onPress={handleEditProfile}
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text variant="h3" style={styles.statValue}>
              12
            </Text>
            <Text variant="caption" color="secondary">
              Appointments
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text variant="h3" style={styles.statValue}>
              3
            </Text>
            <Text variant="caption" color="secondary">
              Professionals
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text variant="h3" style={styles.statValue}>
              5
            </Text>
            <Text variant="caption" color="secondary">
              Reviews
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <Text style={styles.menuIconText}>{item.icon}</Text>
              </View>
              <View style={styles.menuContent}>
                <Text variant="body" style={styles.menuTitle}>
                  {item.title}
                </Text>
                <Text variant="caption" color="secondary">
                  {item.subtitle}
                </Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Card variant="outlined">
            <Card.Content>
              <Text variant="h4" style={styles.quickActionsTitle}>
                Quick Actions
              </Text>
              <View style={styles.quickActionsGrid}>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => navigation.navigate('Search' as any)}
                  style={styles.quickActionButton}
                >
                  Book Appointment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => navigation.navigate('Appointments' as any)}
                  style={styles.quickActionButton}
                >
                  My Appointments
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            variant="ghost"
            size="lg"
            fullWidth
            onPress={handleLogout}
          >
            Log Out
          </Button>
        </View>

        {/* App Version */}
        <Text variant="caption" color="secondary" style={styles.version}>
          Turnify v1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 16,
  },
  name: {
    marginTop: 16,
    marginBottom: 4,
  },
  editButton: {
    marginTop: 16,
    minWidth: 120,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#3B82F6',
    marginBottom: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  menu: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  menuArrow: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  quickActions: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quickActionsTitle: {
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  version: {
    textAlign: 'center',
    marginBottom: 32,
  },
});

export default ProfileScreen;
