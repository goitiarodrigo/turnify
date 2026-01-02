// src/screens/patient/AppointmentDetailScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { format, addMinutes, isPast } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Card from '@/components/common/Card/Card';
import Avatar from '@/components/common/Avatar/Avatar';
import Badge from '@/components/common/Badge/Badge';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import Input from '@/components/common/Input/Input';
import { useAppointmentDetail, useCancelAppointment } from '@/hooks/useAppointments';
import { handleAPIError } from '@/utils/errorHandler';

const AppointmentDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { appointmentId } = route.params as any;

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const { data: appointment, isLoading } = useAppointmentDetail(appointmentId);
  const cancelMutation = useCancelAppointment();

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      Alert.alert('Required', 'Please provide a reason for cancellation.');
      return;
    }

    try {
      await cancelMutation.mutateAsync({
        appointmentId,
        reason: cancelReason,
      });

      Alert.alert(
        'Appointment Cancelled',
        'Your appointment has been cancelled successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      handleAPIError(error);
    }
  };

  const handleReschedule = () => {
    if (!appointment) return;

    navigation.navigate('BookAppointment' as any, {
      professionalId: appointment.professionalId,
      clinicId: appointment.clinicId,
      rescheduleFrom: appointmentId,
    });
  };

  const handleGetDirections = () => {
    if (!appointment?.clinic) return;

    const { lat, lng } = appointment.clinic.location || {};
    if (!lat || !lng) {
      Alert.alert('Error', 'Clinic location not available');
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const handleWriteReview = () => {
    if (!appointment) return;

    navigation.navigate('WriteReview' as any, {
      professionalId: appointment.professionalId,
      appointmentId: appointment.id,
    });
  };

  if (isLoading || !appointment) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      </Screen>
    );
  }

  const appointmentDate = new Date(appointment.dateTime);
  const endTime = addMinutes(appointmentDate, appointment.duration);
  const isUpcoming = !isPast(appointmentDate);
  const canCancel =
    appointment.status !== 'completed' &&
    appointment.status !== 'cancelled' &&
    appointment.status !== 'no-show' &&
    isUpcoming;
  const canReschedule = canCancel;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'confirmed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'completed':
        return 'neutral';
      case 'cancelled':
        return 'error';
      case 'no-show':
        return 'error';
      default:
        return 'neutral';
    }
  };

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Button variant="ghost" size="sm" onPress={() => navigation.goBack()}>
            ← Back
          </Button>
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <Badge variant={getStatusVariant(appointment.status)} size="lg">
            {appointment.status.toUpperCase()}
          </Badge>
        </View>

        {/* Confirmation Number */}
        <Card variant="elevated" style={styles.confirmationCard}>
          <Card.Content>
            <Text variant="caption" color="secondary">
              Confirmation Number
            </Text>
            <Text variant="h3" style={styles.confirmationNumber}>
              {appointment.confirmationNumber}
            </Text>
          </Card.Content>
        </Card>

        {/* Date & Time */}
        <Card variant="outlined">
          <Card.Content>
            <Text variant="h4" style={styles.cardTitle}>
              📅 Date & Time
            </Text>
            <Text variant="h3" style={styles.dateTime}>
              {format(appointmentDate, 'EEEE, MMMM dd, yyyy')}
            </Text>
            <Text variant="h4" style={styles.time}>
              {format(appointmentDate, 'h:mm a')} - {format(endTime, 'h:mm a')}
            </Text>
            <Text variant="caption" color="secondary">
              Duration: {appointment.duration} minutes
            </Text>
          </Card.Content>
        </Card>

        {/* Professional */}
        <Card variant="outlined">
          <Card.Content>
            <Text variant="h4" style={styles.cardTitle}>
              👨‍⚕️ Professional
            </Text>
            <View style={styles.professionalInfo}>
              <Avatar
                uri={appointment.professional.avatar || ''}
                name={appointment.professional.name || 'Professional'}
                size="lg"
              />
              <View style={styles.professionalDetails}>
                <Text variant="h4">{appointment.professional.name}</Text>
                <Text variant="body" color="secondary">
                  {appointment.professional.specialty}
                </Text>
                {appointment.professional.rating && (
                  <Text variant="caption" color="secondary">
                    ⭐ {appointment.professional.rating.toFixed(1)} rating
                  </Text>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Clinic */}
        <Card variant="outlined">
          <Card.Content>
            <Text variant="h4" style={styles.cardTitle}>
              🏥 Clinic
            </Text>
            <Text variant="body" style={styles.clinicName}>
              {appointment.clinic.name}
            </Text>
            {appointment.clinic.address && (
              <Text variant="body" color="secondary">
                {appointment.clinic.address}
              </Text>
            )}
            <Button
              variant="outline"
              size="sm"
              onPress={handleGetDirections}
              style={styles.directionsButton}
            >
              Get Directions
            </Button>
          </Card.Content>
        </Card>

        {/* Appointment Details */}
        <Card variant="outlined">
          <Card.Content>
            <Text variant="h4" style={styles.cardTitle}>
              📋 Appointment Details
            </Text>

            <View style={styles.detailRow}>
              <Text variant="body" style={styles.detailLabel}>
                Type:
              </Text>
              <Text variant="body">
                {appointment.type === 'appointment' ? 'Scheduled' : 'Walk-in'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="body" style={styles.detailLabel}>
                Reason:
              </Text>
              <Text variant="body">{appointment.reason}</Text>
            </View>

            {appointment.symptoms && (
              <View style={styles.detailRow}>
                <Text variant="body" style={styles.detailLabel}>
                  Symptoms:
                </Text>
                <Text variant="body">{appointment.symptoms}</Text>
              </View>
            )}

            {appointment.notes && (
              <View style={styles.detailRow}>
                <Text variant="body" style={styles.detailLabel}>
                  Notes:
                </Text>
                <Text variant="body">{appointment.notes}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text variant="body" style={styles.detailLabel}>
                First Visit:
              </Text>
              <Text variant="body">{appointment.firstVisit ? 'Yes' : 'No'}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Payment Info */}
        <Card variant="outlined">
          <Card.Content>
            <Text variant="h4" style={styles.cardTitle}>
              💳 Payment
            </Text>

            <View style={styles.paymentRow}>
              <Text variant="body" style={styles.detailLabel}>
                Fee:
              </Text>
              <Text variant="h4">
                {appointment.currency} ${appointment.fee.toFixed(2)}
              </Text>
            </View>

            <View style={styles.paymentRow}>
              <Text variant="body" style={styles.detailLabel}>
                Status:
              </Text>
              <Badge variant={appointment.paymentStatus === 'paid' ? 'success' : 'warning'}>
                {appointment.paymentStatus}
              </Badge>
            </View>
          </Card.Content>
        </Card>

        {/* Cancel Dialog */}
        {showCancelDialog && (
          <Card variant="elevated" style={styles.cancelDialog}>
            <Card.Content>
              <Text variant="h4" style={styles.dialogTitle}>
                Cancel Appointment
              </Text>
              <Text variant="body" color="secondary" style={styles.dialogText}>
                Please provide a reason for cancellation:
              </Text>

              <Input
                placeholder="e.g., Schedule conflict, Feeling better"
                value={cancelReason}
                onChangeText={setCancelReason}
                multiline
                numberOfLines={3}
              />

              <View style={styles.dialogActions}>
                <Button
                  variant="ghost"
                  onPress={() => {
                    setShowCancelDialog(false);
                    setCancelReason('');
                  }}
                  style={styles.dialogButton}
                >
                  Keep Appointment
                </Button>
                <Button
                  variant="primary"
                  onPress={handleCancel}
                  loading={cancelMutation.isPending}
                  style={styles.dialogButton}
                >
                  Confirm Cancel
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Actions */}
        {!showCancelDialog && (
          <View style={styles.actions}>
            {appointment.status === 'completed' && (
              <Button variant="primary" size="lg" fullWidth onPress={handleWriteReview}>
                Write a Review
              </Button>
            )}

            {canReschedule && (
              <Button variant="secondary" size="lg" fullWidth onPress={handleReschedule}>
                Reschedule Appointment
              </Button>
            )}

            {canCancel && (
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onPress={() => setShowCancelDialog(true)}
              >
                Cancel Appointment
              </Button>
            )}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmationCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  confirmationNumber: {
    marginTop: 4,
    fontFamily: 'monospace',
  },
  cardTitle: {
    marginBottom: 12,
  },
  dateTime: {
    marginBottom: 8,
  },
  time: {
    color: '#3B82F6',
    marginBottom: 4,
  },
  professionalInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  professionalDetails: {
    flex: 1,
  },
  clinicName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  directionsButton: {
    marginTop: 12,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelDialog: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  dialogTitle: {
    color: '#EF4444',
    marginBottom: 8,
  },
  dialogText: {
    marginBottom: 16,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  dialogButton: {
    flex: 1,
  },
  actions: {
    padding: 16,
    gap: 12,
    marginTop: 24,
    paddingBottom: 32,
  },
});

export default AppointmentDetailScreen;
