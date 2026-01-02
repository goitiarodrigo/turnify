import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';

// import { Input, Button } from '@/components';
import { useAuthStore } from '@/store/store';
import { handleAPIError } from '@/utils/errorHandler';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import { Button, Input } from '@/components/common';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
});

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      setLoading(true);
      await login(data);
      // Navigation handled by AppNavigator based on auth state
    } catch (error) {
      handleAPIError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scrollable>
      <View style={styles.container}>
        <Text variant="h1" style={styles.title}>
          Welcome Back
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Email"
              placeholder="your@email.com"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              secureTextEntry
            />
          )}
        />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        >
          Sign In
        </Button>

        <Button
          variant="ghost"
          onPress={() => navigation.navigate('ForgotPassword' as any)}
        >
          Forgot Password?
        </Button>

        <View style={styles.signupContainer}>
          <Text>Don't have an account? </Text>
          <Button
            variant="ghost"
            onPress={() => navigation.navigate('Register' as any)}
          >
            Sign Up
          </Button>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    marginBottom: 32,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default LoginScreen;