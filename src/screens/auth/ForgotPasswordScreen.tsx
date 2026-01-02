// src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import Card from '@/components/common/Card/Card';
import { handleAPIError } from '@/utils/errorHandler';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});

type FormData = {
  email: string;
};

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const emailValue = watch('email');

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      // API call would go here
      // await authAPI.forgotPassword(data.email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setEmailSent(true);
    } catch (error) {
      handleAPIError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!emailValue) return;

    try {
      setLoading(true);

      // API call would go here
      // await authAPI.forgotPassword(emailValue);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert('Email Sent', 'Password reset instructions have been resent to your email.');
    } catch (error) {
      handleAPIError(error);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Screen>
        <View style={styles.container}>
          {/* Header */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text variant="body" style={styles.backText}>
              ← Back to Login
            </Text>
          </TouchableOpacity>

          {/* Success Message */}
          <View style={styles.successContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📧</Text>
            </View>

            <Text variant="h2" style={styles.successTitle}>
              Check Your Email
            </Text>

            <Text variant="body" color="secondary" style={styles.successText}>
              We've sent password reset instructions to:
            </Text>

            <Text variant="body" style={styles.emailText}>
              {emailValue}
            </Text>

            <Card variant="outlined" style={styles.instructionsCard}>
              <Card.Content>
                <Text variant="h4" style={styles.instructionsTitle}>
                  What's Next?
                </Text>
                <View style={styles.stepsList}>
                  <View style={styles.step}>
                    <View style={styles.stepNumber}>
                      <Text variant="caption" style={styles.stepNumberText}>
                        1
                      </Text>
                    </View>
                    <Text variant="body">Check your email inbox</Text>
                  </View>
                  <View style={styles.step}>
                    <View style={styles.stepNumber}>
                      <Text variant="caption" style={styles.stepNumberText}>
                        2
                      </Text>
                    </View>
                    <Text variant="body">Click the password reset link</Text>
                  </View>
                  <View style={styles.step}>
                    <View style={styles.stepNumber}>
                      <Text variant="caption" style={styles.stepNumberText}>
                        3
                      </Text>
                    </View>
                    <Text variant="body">Create a new password</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            <Text variant="caption" color="secondary" style={styles.noteText}>
              Didn't receive the email? Check your spam folder or{' '}
              <Text style={styles.resendLink} onPress={handleResendEmail}>
                resend the email
              </Text>
              .
            </Text>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => navigation.navigate('Login' as any)}
              style={styles.backToLoginButton}
            >
              Back to Login
            </Button>
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable>
      <View style={styles.container}>
        {/* Header */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text variant="body" style={styles.backText}>
            ← Back
          </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔒</Text>
          </View>

          <Text variant="h1" style={styles.title}>
            Forgot Password?
          </Text>

          <Text variant="body" color="secondary" style={styles.subtitle}>
            No worries! Enter your email address and we'll send you instructions to
            reset your password.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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
                autoFocus
              />
            )}
          />

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitButton}
          >
            Send Reset Instructions
          </Button>
        </View>

        {/* Info Card */}
        <Card variant="outlined" style={styles.infoCard}>
          <Card.Content>
            <Text variant="body" color="secondary" style={styles.infoText}>
              💡 You'll receive an email with a link to reset your password. The link
              will expire in 24 hours for security reasons.
            </Text>
          </Card.Content>
        </Card>

        {/* Back to Login */}
        <View style={styles.loginContainer}>
          <Text variant="body" color="secondary">
            Remember your password?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login' as any)}>
            <Text variant="body" style={styles.loginLink}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  backButton: {
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#3B82F6',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 8,
  },
  infoCard: {
    marginBottom: 24,
    backgroundColor: '#F0F9FF',
  },
  infoText: {
    lineHeight: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLink: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
  },
  successTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontWeight: '600',
    color: '#3B82F6',
    marginBottom: 32,
  },
  instructionsCard: {
    width: '100%',
    marginBottom: 24,
  },
  instructionsTitle: {
    marginBottom: 16,
  },
  stepsList: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  noteText: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  resendLink: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  backToLoginButton: {
    width: '100%',
  },
});

export default ForgotPasswordScreen;
