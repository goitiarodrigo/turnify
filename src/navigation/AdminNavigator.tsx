// src/navigation/AdminNavigator.tsx
/**
 * Admin Navigator
 * Navigation flow for admin users with drawer
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { AdminStackParamList, AdminDrawerParamList } from '@/types/navigation';
import { useTheme } from '@/context/ThemeContext';

// Import screens (placeholders)
import { View, Text } from 'react-native';

// ============================================================================
// PLACEHOLDER SCREENS
// ============================================================================

const DashboardScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Admin Dashboard Screen</Text>
  </View>
);

const ProfessionalsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Professionals Screen</Text>
  </View>
);

const SpecialtiesScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Specialties Screen</Text>
  </View>
);

const AnalyticsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Analytics Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Settings Screen</Text>
  </View>
);

const AddProfessionalScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Add Professional Screen</Text>
  </View>
);

const EditProfessionalScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Edit Professional Screen</Text>
  </View>
);

const ProfessionalDetailScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Professional Detail Screen</Text>
  </View>
);

const ClinicSettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Clinic Settings Screen</Text>
  </View>
);

const PaymentSettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Payment Settings Screen</Text>
  </View>
);

const NotificationsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Notifications Screen</Text>
  </View>
);

const AppointmentsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Appointments Screen</Text>
  </View>
);

const PatientsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Patients Screen</Text>
  </View>
);

const ReportsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Reports Screen</Text>
  </View>
);

// ============================================================================
// NAVIGATORS
// ============================================================================

const Drawer = createDrawerNavigator<AdminDrawerParamList>();
const Stack = createNativeStackNavigator<AdminStackParamList>();

// ============================================================================
// DRAWER NAVIGATOR
// ============================================================================

const AdminDrawer: React.FC = () => {
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
          title: 'Admin Dashboard',
          // drawerIcon: ({ color, size }) => <DashboardIcon color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="Professionals"
        component={ProfessionalsScreen}
        options={{
          drawerLabel: 'Professionals',
          title: 'Manage Professionals',
          // drawerIcon: ({ color, size }) => <UsersIcon color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="Specialties"
        component={SpecialtiesScreen}
        options={{
          drawerLabel: 'Specialties',
          title: 'Manage Specialties',
          // drawerIcon: ({ color, size }) => <TagIcon color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          drawerLabel: 'Analytics',
          title: 'Analytics & Reports',
          // drawerIcon: ({ color, size }) => <ChartIcon color={color} size={size} />,
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: 'Settings',
          title: 'Clinic Settings',
          // drawerIcon: ({ color, size }) => <SettingsIcon color={color} size={size} />,
        }}
      />
    </Drawer.Navigator>
  );
};

// ============================================================================
// ADMIN NAVIGATOR
// ============================================================================

const AdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="AdminDrawer" component={AdminDrawer} />

      <Stack.Screen
        name="AddProfessional"
        component={AddProfessionalScreen}
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen name="EditProfessional" component={EditProfessionalScreen} />

      <Stack.Screen name="ProfessionalDetail" component={ProfessionalDetailScreen} />

      <Stack.Screen name="ClinicSettings" component={ClinicSettingsScreen} />

      <Stack.Screen name="PaymentSettings" component={PaymentSettingsScreen} />

      <Stack.Screen name="Notifications" component={NotificationsScreen} />

      <Stack.Screen name="Appointments" component={AppointmentsScreen} />

      <Stack.Screen name="Patients" component={PatientsScreen} />

      <Stack.Screen name="Reports" component={ReportsScreen} />
    </Stack.Navigator>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default AdminNavigator;
