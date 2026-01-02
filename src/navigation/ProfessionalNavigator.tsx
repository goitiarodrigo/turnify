// src/navigation/ProfessionalNavigator.tsx
/**
 * Professional Navigator
 * Navigation flow for professional users with drawer
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { ProfessionalStackParamList, ProfessionalDrawerParamList } from '@/types/navigation';
import { useTheme } from '@/context/ThemeContext';

// Import screens (placeholders)
import { View, Text } from 'react-native';

// ============================================================================
// PLACEHOLDER SCREENS
// ============================================================================

const DashboardScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Dashboard Screen</Text>
  </View>
);

const ScheduleScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Schedule Screen</Text>
  </View>
);

const QueueManagementScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Queue Management Screen</Text>
  </View>
);

const PatientsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Patients Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Settings Screen</Text>
  </View>
);

const PatientDetailScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Patient Detail Screen</Text>
  </View>
);

const AppointmentDetailScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Appointment Detail Screen</Text>
  </View>
);

const QueueDetailScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Queue Detail Screen</Text>
  </View>
);

const EditScheduleScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Edit Schedule Screen</Text>
  </View>
);

const NotificationsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Notifications Screen</Text>
  </View>
);

const StatisticsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Statistics Screen</Text>
  </View>
);

// ============================================================================
// NAVIGATORS
// ============================================================================

const Drawer = createDrawerNavigator<ProfessionalDrawerParamList>();
const Stack = createNativeStackNavigator<ProfessionalStackParamList>();

// ============================================================================
// DRAWER NAVIGATOR
// ============================================================================

const ProfessionalDrawer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: theme.colors.primary[500],
        drawerInactiveTintColor: theme.colors.text.secondary,
        drawerStyle: {
          backgroundColor: theme.colors.background.primary,
          width: 280,
        },
        drawerLabelStyle: {
          fontSize: theme.typography.fontSize.base,
          fontFamily: theme.typography.fontFamily.body,
        },
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: {
          fontSize: theme.typography.fontSize.lg,
          fontFamily: theme.typography.fontFamily.heading,
        },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
          // drawerIcon: ({ color, size }) => <DashboardIcon color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          drawerLabel: 'Schedule',
          title: 'My Schedule',
          // drawerIcon: ({ color, size }) => <CalendarIcon color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="QueueManagement"
        component={QueueManagementScreen}
        options={{
          drawerLabel: 'Queue',
          title: 'Queue Management',
          // drawerIcon: ({ color, size }) => <QueueIcon color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="Patients"
        component={PatientsScreen}
        options={{
          drawerLabel: 'Patients',
          title: 'My Patients',
          // drawerIcon: ({ color, size }) => <UsersIcon color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
          title: 'Settings',
          // drawerIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />,
        }}
      />
    </Drawer.Navigator>
  );
};

// ============================================================================
// PROFESSIONAL NAVIGATOR
// ============================================================================

const ProfessionalNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ProfessionalDrawer" component={ProfessionalDrawer} />

      <Stack.Screen name="PatientDetail" component={PatientDetailScreen} />

      <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />

      <Stack.Screen name="QueueDetail" component={QueueDetailScreen} />

      <Stack.Screen
        name="EditSchedule"
        component={EditScheduleScreen}
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen name="Notifications" component={NotificationsScreen} />

      <Stack.Screen name="Statistics" component={StatisticsScreen} />
    </Stack.Navigator>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default ProfessionalNavigator;
