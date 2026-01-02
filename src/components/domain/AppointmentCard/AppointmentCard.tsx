import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
// import { Card, Text, Avatar, Badge, Button } from '@/components';
import { Appointment } from '@/types/models';
import { format } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/common/Card/Card';
import Avatar from '@/components/common/Avatar/Avatar';
import Badge from '@/components/common/Badge/Badge';
import Button from '@/components/common/Button/Button';
import Text from '@/components/common/Text/Text';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  showActions?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPress,
  onCancel,
  onReschedule,
  showActions = true,
}) => {
  const { theme } = useTheme();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'info';
      case 'confirmed':
        return 'success';
      case 'completed':
        return 'neutral';
      case 'cancelled':
        return 'error';
      default:
        return 'neutral';
    }
  };

  return (
    <Card variant="elevated" onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.professionalInfo}>
            <Avatar
              uri={appointment.professional.avatar || ''}
              name={appointment.professional.name}
              size="md"
            />
            <View style={styles.professionalDetails}>
              <Text variant="h4">{appointment.professional.name}</Text>
              <Text variant="body" color="secondary">
                {appointment.professional.specialty}
              </Text>
            </View>
          </View>
          <Badge variant={getStatusVariant(appointment.status)}>{appointment.status}</Badge>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text variant="body">📅 {format(new Date(appointment.dateTime), 'MMM dd, yyyy - h:mm a')}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text variant="body">📍 {appointment.clinic.name}</Text>
          </View>
        </View>

        {showActions && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
          <View style={styles.actions}>
            {onReschedule && (
              <Button variant="outline" size="sm" onPress={onReschedule}>
                Reschedule
              </Button>
            )}
            {onCancel && (
              <Button variant="ghost" size="sm" onPress={onCancel}>
                Cancel
              </Button>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  professionalInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  professionalDetails: {
    marginLeft: 12,
    flex: 1,
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});

export default AppointmentCard;