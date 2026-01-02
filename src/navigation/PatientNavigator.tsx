// src/navigation/PatientNavigator.tsx
/**
 * Patient Navigator
 * Navigation flow for patient users with bottom tabs
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { PatientStackParamList, PatientTabParamList } from '@/types/navigation';
import { useTheme } from '@/context/ThemeContext';

// Import screens
import { View, Text } from 'react-native';
import HomeScreen from '@/screens/patient/HomeScreen';
import SearchScreen from '@/screens/patient/SearchScreen';
import ClinicDetailScreen from '@/screens/patient/ClinicDetailScreen';
import ProfessionalDetailScreen from '@/screens/patient/ProfessionalDetailScreen';
import BookAppointmentScreen from '@/screens/patient/BookAppointmentScreen';
import JoinQueueScreen from '@/screens/patient/JoinQueueScreen';
import QueueTrackingScreen from '@/screens/patient/QueueTrackingScreen';
import AppointmentsListScreen from '@/screens/patient/AppointmentsListScreen';
import AppointmentDetailScreen from '@/screens/patient/AppointmentDetailScreen';
import ProfileScreen from '@/screens/patient/ProfileScreen';
import EditProfileScreen from '@/screens/patient/EditProfileScreen';
import SettingsScreen from '@/screens/patient/SettingsScreen';
import NotificationsScreen from '@/screens/patient/NotificationsScreen';
import PaymentMethodsScreen from '@/screens/patient/PaymentMethodsScreen';
import WriteReviewScreen from '@/screens/patient/WriteReviewScreen';

// ============================================================================
// PLACEHOLDER SCREENS (TODO: Implement these)
// ============================================================================

const QueueTabScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Queue Tab Screen</Text>
  </View>
);

// ============================================================================
// NAVIGATORS
// ============================================================================

const Tab = createBottomTabNavigator<PatientTabParamList>();
const Stack = createNativeStackNavigator<PatientStackParamList>();

// ============================================================================
// TAB NAVIGATOR
// ============================================================================

const PatientTabs: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary[500],
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.light,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontFamily: theme.typography.fontFamily.bodyBold,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          // tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Appointments"
        component={AppointmentsListScreen}
        options={{
          tabBarLabel: 'Appointments',
          // tabBarIcon: ({ color, size }) => <CalendarIcon color={color} size={size} />,
          // tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />

      <Tab.Screen
        name="QueueTab"
        component={QueueTabScreen}
        options={{
          tabBarLabel: 'Queue',
          // tabBarIcon: ({ color, size }) => <QueueIcon color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          // tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

// ============================================================================
// PATIENT NAVIGATOR
// ============================================================================

const PatientNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="PatientTabs" component={PatientTabs} />

      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />

      <Stack.Screen name="ClinicDetail" component={ClinicDetailScreen} />

      <Stack.Screen name="ProfessionalDetail" component={ProfessionalDetailScreen} />

      <Stack.Screen
        name="BookAppointment"
        component={BookAppointmentScreen}
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />

      <Stack.Screen
        name="JoinQueue"
        component={JoinQueueScreen}
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="QueueTracking"
        component={QueueTrackingScreen}
        options={{
          gestureEnabled: false,
        }}
      />

      <Stack.Screen name="Notifications" component={NotificationsScreen} />

      <Stack.Screen name="EditProfile" component={EditProfileScreen} />

      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />

      <Stack.Screen name="Settings" component={SettingsScreen} />

      <Stack.Screen
        name="WriteReview"
        component={WriteReviewScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default PatientNavigator;
