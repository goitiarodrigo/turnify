// src/screens/patient/BookAppointmentScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { format, addDays, startOfDay } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import Card from '@/components/common/Card/Card';
import Avatar from '@/components/common/Avatar/Avatar';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useProfessional, useProfessionalAvailability } from '@/hooks/useProfessionals';
import { useCreateAppointment } from '@/hooks/useAppointments';
import { handleAPIError } from '@/utils/errorHandler';
import type { AppointmentBookingData } from '@/types/models';

const schema = yup.object({
  reason: yup.string().required('Reason is required').min(5, 'Please provide more details'),
  symptoms: yup.string(),
  notes: yup.string(),
});

type FormData = {
  reason: string;
  symptoms?: string;
  notes?: string;
};

const BookAppointmentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { professionalId, clinicId } = route.params as any;

  const [selectedDate, setSelectedDate] = useState<string>(
    format(startOfDay(new Date()), 'yyyy-MM-dd')
  );
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [firstVisit, setFirstVisit] = useState<boolean>(true);

  const { data: professional, isLoading: professionalLoading } =
    useProfessional(professionalId);

  const { data: availability, isLoading: availabilityLoading } =
    useProfessionalAvailability(
      professionalId,
      {
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
        duration: professional?.appointmentDuration || 30,
      },
      !!professional
    );

  const createAppointmentMutation = useCreateAppointment();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select a date and time for your appointment');
      return;
    }

    if (!professional) return;

    try {
      const appointmentData: AppointmentBookingData = {
        professionalId,
        clinicId,
        dateTime: `${selectedDate}T${selectedTime}:00`,
        duration: professional.appointmentDuration,
        reason: data.reason,
        symptoms: data.symptoms,
        notes: data.notes,
        firstVisit,
      };

      await createAppointmentMutation.mutateAsync(appointmentData);

      Alert.alert(
        'Success!',
        'Your appointment has been booked successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Appointments' as any),
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

  // Generate next 7 days for date selection
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE'),
      day: format(date, 'dd'),
      month: format(date, 'MMM'),
    };
  });

  // Get available time slots for selected date
  const selectedDateAvailability = availability?.find(
    (day) => day.date === selectedDate
  );

  const timeSlots = selectedDateAvailability?.slots.filter((slot) => slot.available) || [];

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Button variant="ghost" size="sm" onPress={() => navigation.goBack()}>
            ← Cancel
          </Button>
          <Text variant="h3">Book Appointment</Text>
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
                  ${professional.consultationFee.min} consultation fee
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Select Date
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesContainer}
          >
            {dates.map((dateItem) => (
              <TouchableOpacity
                key={dateItem.date}
                style={[
                  styles.dateCard,
                  selectedDate === dateItem.date && styles.dateCardSelected,
                ]}
                onPress={() => {
                  setSelectedDate(dateItem.date);
                  setSelectedTime('');
                }}
              >
                <Text
                  variant="caption"
                  color={selectedDate === dateItem.date ? 'primary' : 'secondary'}
                >
                  {dateItem.label}
                </Text>
                <Text
                  variant="h3"
                  color={selectedDate === dateItem.date ? 'primary' : undefined}
                >
                  {dateItem.day}
                </Text>
                <Text
                  variant="caption"
                  color={selectedDate === dateItem.date ? 'primary' : 'secondary'}
                >
                  {dateItem.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Select Time
          </Text>
          {availabilityLoading ? (
            <LoadingSpinner />
          ) : timeSlots.length > 0 ? (
            <View style={styles.timeSlotsGrid}>
              {timeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    selectedTime === slot.startTime && styles.timeSlotSelected,
                  ]}
                  onPress={() => setSelectedTime(slot.startTime)}
                >
                  <Text
                    variant="body"
                    color={selectedTime === slot.startTime ? 'primary' : undefined}
                  >
                    {slot.startTime}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text variant="body" color="secondary">
              No available slots for this date
            </Text>
          )}
        </View>

        {/* Appointment Details */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Appointment Details
          </Text>

          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Reason for visit *"
                placeholder="e.g., Annual checkup, Follow-up visit"
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
                placeholder="Describe any symptoms you're experiencing"
                value={value}
                onChangeText={onChange}
                error={errors.symptoms?.message}
                multiline
                numberOfLines={3}
              />
            )}
          />

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Additional notes (optional)"
                placeholder="Any other information the doctor should know"
                value={value}
                onChangeText={onChange}
                error={errors.notes?.message}
                multiline
                numberOfLines={2}
              />
            )}
          />

          {/* First Visit Toggle */}
          <View style={styles.toggleContainer}>
            <Text variant="body">Is this your first visit?</Text>
            <View style={styles.toggleButtons}>
              <Button
                variant={firstVisit ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setFirstVisit(true)}
                style={styles.toggleButton}
              >
                Yes
              </Button>
              <Button
                variant={!firstVisit ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setFirstVisit(false)}
                style={styles.toggleButton}
              >
                No
              </Button>
            </View>
          </View>
        </View>

        {/* Summary */}
        {selectedDate && selectedTime && (
          <Card variant="outlined" style={styles.summaryCard}>
            <Card.Content>
              <Text variant="h4" style={styles.summaryTitle}>
                Appointment Summary
              </Text>
              <View style={styles.summaryRow}>
                <Text variant="body" color="secondary">
                  Date & Time:
                </Text>
                <Text variant="body" style={styles.summaryValue}>
                  {format(new Date(`${selectedDate}T${selectedTime}`), 'MMM dd, yyyy • h:mm a')}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text variant="body" color="secondary">
                  Duration:
                </Text>
                <Text variant="body" style={styles.summaryValue}>
                  {professional.appointmentDuration} minutes
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text variant="body" color="secondary">
                  Fee:
                </Text>
                <Text variant="body" style={styles.summaryValue}>
                  ${professional.consultationFee.min}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            loading={createAppointmentMutation.isPending}
            disabled={!selectedDate || !selectedTime}
          >
            Confirm Appointment
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
    marginBottom: 24,
  },
  professionalInfo: {
    flexDirection: 'row',
  },
  professionalDetails: {
    marginLeft: 12,
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  datesContainer: {
    gap: 12,
  },
  dateCard: {
    width: 70,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dateCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  timeSlotSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  toggleButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    minWidth: 60,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryValue: {
    fontWeight: '600',
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

export default BookAppointmentScreen;
