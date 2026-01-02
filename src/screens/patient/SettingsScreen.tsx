// src/screens/patient/SettingsScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Card from '@/components/common/Card/Card';
import { useAuthStore } from '@/store/store';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();

  // Notification Settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // App Settings
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Delete account logic
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text variant="body" style={styles.settingTitle}>
          {title}
        </Text>
        <Text variant="caption" color="secondary">
          {subtitle}
        </Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Button variant="ghost" size="sm" onPress={() => navigation.goBack()}>
            ← Back
          </Button>
          <Text variant="h3">Settings</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Notifications
          </Text>
          <Card variant="outlined">
            <Card.Content>
              {renderSettingItem(
                'Push Notifications',
                'Receive push notifications on your device',
                pushNotifications,
                setPushNotifications
              )}
              {renderSettingItem(
                'Email Notifications',
                'Receive notifications via email',
                emailNotifications,
                setEmailNotifications
              )}
              {renderSettingItem(
                'SMS Notifications',
                'Receive notifications via text message',
                smsNotifications,
                setSmsNotifications
              )}
            </Card.Content>
          </Card>
        </View>

        {/* Privacy & Security */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Privacy & Security
          </Text>
          <Card variant="outlined">
            <Card.Content>
              {renderSettingItem(
                'Location Services',
                'Allow app to access your location',
                locationServices,
                setLocationServices
              )}
              <Button
                variant="outline"
                size="sm"
                onPress={() => {}}
                style={styles.actionButton}
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                size="sm"
                onPress={() => {}}
                style={styles.actionButton}
              >
                Privacy Policy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onPress={() => {}}
                style={styles.actionButton}
              >
                Terms of Service
              </Button>
            </Card.Content>
          </Card>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Appearance
          </Text>
          <Card variant="outlined">
            <Card.Content>
              {renderSettingItem(
                'Dark Mode',
                'Use dark theme for the app',
                darkMode,
                setDarkMode
              )}
            </Card.Content>
          </Card>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            About
          </Text>
          <Card variant="outlined">
            <Card.Content>
              <View style={styles.aboutItem}>
                <Text variant="body">App Version</Text>
                <Text variant="body" color="secondary">
                  1.0.0
                </Text>
              </View>
              <Button
                variant="outline"
                size="sm"
                onPress={() => {}}
                style={styles.actionButton}
              >
                Help & Support
              </Button>
              <Button
                variant="outline"
                size="sm"
                onPress={() => {}}
                style={styles.actionButton}
              >
                Send Feedback
              </Button>
            </Card.Content>
          </Card>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text variant="h4" style={[styles.sectionTitle, styles.dangerTitle]}>
            Danger Zone
          </Text>
          <Card variant="outlined" style={styles.dangerCard}>
            <Card.Content>
              <Text variant="body" color="secondary" style={styles.dangerText}>
                Once you delete your account, there is no going back. Please be certain.
              </Text>
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onPress={handleDeleteAccount}
                style={styles.deleteButton}
              >
                Delete Account
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  actionButton: {
    marginTop: 12,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dangerTitle: {
    color: '#EF4444',
  },
  dangerCard: {
    borderColor: '#EF4444',
  },
  dangerText: {
    marginBottom: 16,
  },
  deleteButton: {
    color: '#EF4444',
  },
});

export default SettingsScreen;
