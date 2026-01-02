// src/screens/patient/JoinQueueScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '@/context/ThemeContext';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import Card from '@/components/common/Card/Card';
import Avatar from '@/components/common/Avatar/Avatar';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useProfessional } from '@/hooks/useProfessionals';
import { useJoinQueue } from '@/hooks/useQueue';
import { handleAPIError } from '@/utils/errorHandler';
import type { QueueJoinData, TravelMode, Coordinates } from '@/types/models';

const schema = yup.object({
  reason: yup.string().required('Reason is required').min(5, 'Please provide more details'),
  symptoms: yup.string(),
});

type FormData = {
  reason: string;
  symptoms?: string;
};

const TRAVEL_MODES: { mode: TravelMode; label: string; icon: string; speed: number }[] = [
  { mode: 'driving', label: 'Driving', icon: '🚗', speed: 40 },
  { mode: 'walking', label: 'Walking', icon: '🚶', speed: 5 },
  { mode: 'transit', label: 'Transit', icon: '🚌', speed: 30 },
  { mode: 'bicycling', label: 'Biking', icon: '🚴', speed: 15 },
];

const JoinQueueScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { professionalId, clinicId } = route.params as any;

  const [travelMode, setTravelMode] = useState<TravelMode>('driving');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [travelTime, setTravelTime] = useState<number>(0);

  const { data: professional, isLoading: professionalLoading } =
    useProfessional(professionalId);

  const joinQueueMutation = useJoinQueue();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Get user location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Calculate travel time when location or mode changes
  useEffect(() => {
    if (userLocation && professional?.clinic) {
      calculateTravelTime();
    }
  }, [userLocation, travelMode, professional]);

  const getUserLocation = async () => {
    try {
      // In production, use @react-native-community/geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Location error:', error);
            // Use default location or show error
            Alert.alert(
              'Location Required',
              'Please enable location services to join the queue.'
            );
          }
        );
      }
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const calculateTravelTime = () => {
    if (!userLocation || !professional?.clinic.location) return;

    // Simple distance calculation (Haversine formula)
    const R = 6371; // Earth radius in km
    const dLat = toRad(professional.clinic.location.lat - userLocation.lat);
    const dLng = toRad(professional.clinic.location.lng - userLocation.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(userLocation.lat)) *
        Math.cos(toRad(professional.clinic.location.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    const modeConfig = TRAVEL_MODES.find((m) => m.mode === travelMode);
    const speed = modeConfig?.speed || 40;

    const timeInHours = distance / speed;
    const timeInMinutes = Math.ceil(timeInHours * 60);

    setTravelTime(timeInMinutes);
  };

  const toRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const onSubmit = async (data: FormData) => {
    if (!userLocation) {
      Alert.alert('Error', 'Unable to determine your location. Please try again.');
      return;
    }

    if (!professional) return;

    try {
      const queueData: QueueJoinData = {
        professionalId,
        clinicId,
        reason: data.reason,
        symptoms: data.symptoms,
        travelMode,
        travelTime,
        userLocation,
      };

      const queueEntry = await joinQueueMutation.mutateAsync(queueData);

      Alert.alert(
        'Successfully Joined Queue! 🎉',
        `You are #${queueEntry.position} in line. We'll notify you when it's time to leave.`,
        [
          {
            text: 'Track Position',
            onPress: () =>
              navigation.navigate('QueueTracking' as any, { queueId: queueEntry.id }),
          },
        ]
      );
    } catch (error) {
      handleAPIError(error);
    }
  };

  if (professionalLoading) {
    return (
      <Screen>
        <LoadingSpinner />
      </Screen>
    );
  }

  if (!professional) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text variant="h3">Professional not found</Text>
          <Button variant="primary" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </View>
      </Screen>
    );
  }

  if (!professional.availability.hasQueueOpen) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text variant="h3">Queue is Closed</Text>
          <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
            This professional's virtual queue is currently closed. Please try booking an
            appointment instead.
          </Text>
          <Button
            variant="primary"
            onPress={() =>
              navigation.navigate('BookAppointment' as any, {
                professionalId,
                clinicId,
              })
            }
          >
            Book Appointment
          </Button>
          <Button variant="ghost" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Button variant="ghost" size="sm" onPress={() => navigation.goBack()}>
            ← Cancel
          </Button>
          <Text variant="h3">Join Virtual Queue</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Professional Info */}
        <Card variant="elevated" style={styles.professionalCard}>
          <Card.Content>
            <View style={styles.professionalInfo}>
              <Avatar uri={professional.avatar} name={professional.name} size="md" />
              <View style={styles.professionalDetails}>
                <Text variant="h4">{professional.name}</Text>
                <Text variant="body" color="secondary">
                  {professional.specialty}
                </Text>
                <Text variant="caption" color="secondary">
                  {professional.clinic.name}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Queue Status */}
        <Card variant="outlined" style={styles.queueStatusCard}>
          <Card.Content>
            <Text variant="h4" style={styles.sectionTitle}>
              Current Queue Status
            </Text>
            <View style={styles.queueStats}>
              <View style={styles.statItem}>
                <Text variant="h2" style={styles.statValue}>
                  {professional.availability.queueLength || 0}
                </Text>
                <Text variant="caption" color="secondary">
                  People in Queue
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text variant="h2" style={styles.statValue}>
                  ~{(professional.availability.queueLength || 0) * 15}
                </Text>
                <Text variant="caption" color="secondary">
                  Minutes Wait
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Travel Mode Selection */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            How will you get there?
          </Text>
          <View style={styles.travelModesGrid}>
            {TRAVEL_MODES.map((mode) => (
              <TouchableOpacity
                key={mode.mode}
                style={[
                  styles.travelModeCard,
                  travelMode === mode.mode && styles.travelModeCardSelected,
                ]}
                onPress={() => setTravelMode(mode.mode)}
              >
                <Text style={styles.travelModeIcon}>{mode.icon}</Text>
                <Text
                  variant="body"
                  style={[
                    styles.travelModeLabel,
                    travelMode === mode.mode && styles.travelModeLabelSelected,
                  ]}
                >
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {travelTime > 0 && (
            <Text variant="caption" color="secondary" style={styles.travelTime}>
              Estimated travel time: {travelTime} minutes
            </Text>
          )}
        </View>

        {/* Queue Details */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Visit Details
          </Text>

          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Reason for visit *"
                placeholder="e.g., General consultation, Follow-up"
                value={value}
                onChangeText={onChange}
                error={errors.reason?.message}
                multiline
                numberOfLines={2}
              />
            )}
          />

          <Controller
            control={control}
            name="symptoms"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Symptoms (optional)"
                placeholder="Describe any symptoms"
                value={value}
                onChangeText={onChange}
                error={errors.symptoms?.message}
                multiline
                numberOfLines={3}
              />
            )}
          />
        </View>

        {/* How it Works */}
        <Card variant="outlined" style={styles.howItWorksCard}>
          <Card.Content>
            <Text variant="h4" style={styles.sectionTitle}>
              How Virtual Queue Works
            </Text>
            <View style={styles.stepsList}>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text variant="caption" style={styles.stepNumberText}>
                    1
                  </Text>
                </View>
                <Text variant="body">You join the virtual queue from anywhere</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text variant="caption" style={styles.stepNumberText}>
                    2
                  </Text>
                </View>
                <Text variant="body">We track your position in real-time</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text variant="caption" style={styles.stepNumberText}>
                    3
                  </Text>
                </View>
                <Text variant="body">We notify you when to leave based on travel time</Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text variant="caption" style={styles.stepNumberText}>
                    4
                  </Text>
                </View>
                <Text variant="body">Arrive just in time for your consultation</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            loading={joinQueueMutation.isPending}
            disabled={!userLocation}
          >
            Join Queue
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
  professionalCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  professionalInfo: {
    flexDirection: 'row',
  },
  professionalDetails: {
    marginLeft: 12,
    flex: 1,
  },
  queueStatusCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  queueStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  travelModesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  travelModeCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  travelModeCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  travelModeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  travelModeLabel: {
    fontWeight: '600',
  },
  travelModeLabelSelected: {
    color: '#3B82F6',
  },
  travelTime: {
    marginTop: 12,
    textAlign: 'center',
  },
  howItWorksCard: {
    marginHorizontal: 16,
    marginBottom: 24,
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
  actionContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
});

export default JoinQueueScreen;
