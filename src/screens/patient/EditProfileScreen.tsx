// src/screens/patient/EditProfileScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import Avatar from '@/components/common/Avatar/Avatar';
import { useAuthStore } from '@/store/store';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string(),
  dateOfBirth: yup.string(),
  address: yup.string(),
});

type FormData = {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
};

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.profile?.dateOfBirth || '',
      address: user?.profile?.address?.street || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      // API call would go here
      // await updateProfile(data);

      // Update local user state
      if (user) {
        setUser({
          ...user,
          name: data.name,
          email: data.email,
          phone: data.phone,
        });
      }

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Button variant="ghost" size="sm" onPress={() => navigation.goBack()}>
            ← Cancel
          </Button>
          <Text variant="h3">Edit Profile</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Avatar uri={user?.avatar} name={user?.name || 'User'} size="xl" />
          <Button variant="ghost" size="sm" onPress={() => {}} style={styles.changePhoto}>
            Change Photo
          </Button>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Full Name *"
                placeholder="John Doe"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email *"
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
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Phone Number"
                placeholder="+1 (555) 123-4567"
                value={value}
                onChangeText={onChange}
                error={errors.phone?.message}
                keyboardType="phone-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Date of Birth"
                placeholder="MM/DD/YYYY"
                value={value}
                onChangeText={onChange}
                error={errors.dateOfBirth?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Address"
                placeholder="123 Main St, City, State"
                value={value}
                onChangeText={onChange}
                error={errors.address?.message}
                multiline
                numberOfLines={2}
              />
            )}
          />
        </View>

        {/* Save Button */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          >
            Save Changes
          </Button>
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
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  changePhoto: {
    marginTop: 12,
  },
  form: {
    padding: 16,
  },
  actions: {
    padding: 16,
    paddingBottom: 32,
  },
});

export default EditProfileScreen;
