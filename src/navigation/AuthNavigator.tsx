// src/navigation/AuthNavigator.tsx
/**
 * Auth Navigator
 * Navigation flow for unauthenticated users
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/types/navigation';

// Import screens (these will be created later)
// For now, we'll use placeholder components
import { View, Text } from 'react-native';

// ============================================================================
// PLACEHOLDER SCREENS (Replace with actual screens when created)
// ============================================================================

const SplashScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Splash Screen</Text>
  </View>
);

const OnboardingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Onboarding Screen</Text>
  </View>
);

const OptionalLoginScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Optional Login Screen</Text>
  </View>
);

const LoginScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Login Screen</Text>
  </View>
);

const RegisterScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Register Screen</Text>
  </View>
);

const ForgotPasswordScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Forgot Password Screen</Text>
  </View>
);

const ResetPasswordScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Reset Password Screen</Text>
  </View>
);

// ============================================================================
// STACK NAVIGATOR
// ============================================================================

const Stack = createNativeStackNavigator<AuthStackParamList>();

// ============================================================================
// AUTH NAVIGATOR
// ============================================================================

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationTypeForReplace: 'push',
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          animation: 'fade',
        }}
      />

      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="OptionalLogin"
        component={OptionalLoginScreen}
        options={{
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          presentation: 'modal',
        }}
      />

      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
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

export default AuthNavigator;
