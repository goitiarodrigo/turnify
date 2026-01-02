import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/store/hooks/useAuth';

import AuthNavigator from './AuthNavigator';
import PatientNavigator from './PatientNavigator';
import ProfessionalNavigator from './ProfessionalNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            {user?.role === 'patient' && (
              <Stack.Screen name="Patient" component={PatientNavigator} />
            )}
            {user?.role === 'professional' && (
              <Stack.Screen name="Professional" component={ProfessionalNavigator} />
            )}
            {user?.role === 'admin' && (
              <Stack.Screen name="Admin" component={AdminNavigator} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;