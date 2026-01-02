import React from 'react';
import { View, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/common/Card/Card';
import Text from '@/components/common/Text/Text';
import Badge from '@/components/common/Badge/Badge';
import Avatar from '@/components/common/Avatar/Avatar';
import type { QueueEntry } from '@/types/models';

interface QueuePositionCardProps {
  queueEntry: QueueEntry;
  onPress?: () => void;
  showProfessional?: boolean;
}

const QueuePositionCard: React.FC<QueuePositionCardProps> = ({
  queueEntry,
  onPress,
  showProfessional = true,
}) => {
  const { theme } = useTheme();

  const getStatusColor = (status: QueueEntry['status']) => {
    switch (status) {
      case 'waiting':
        return '#F59E0B'; // Amber
      case 'notified':
        return '#10B981'; // Green
      case 'on-way':
        return '#3B82F6'; // Blue
      case 'arrived':
        return '#8B5CF6'; // Purple
      case 'completed':
        return '#6B7280'; // Gray
      case 'cancelled':
        return '#EF4444'; // Red
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: QueueEntry['status']) => {
    switch (status) {
      case 'waiting':
        return 'Waiting';
      case 'notified':
        return 'Time to Leave!';
      case 'on-way':
        return 'On the Way';
      case 'arrived':
        return 'Arrived';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: QueueEntry['status']) => {
    switch (status) {
      case 'waiting':
        return 'warning' as const;
      case 'notified':
        return 'success' as const;
      case 'on-way':
        return 'info' as const;
      case 'arrived':
        return 'info' as const;
      case 'completed':
        return 'neutral' as const;
      case 'cancelled':
        return 'error' as const;
      default:
        return 'neutral' as const;
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Card variant="elevated" onPress={onPress}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.statusContainer}>
            <Badge variant={getStatusVariant(queueEntry.status)}>
              {getStatusText(queueEntry.status)}
            </Badge>
          </View>
        </View>

        {/* Position Info */}
        <View style={styles.positionContainer}>
          <View style={styles.positionCircle}>
            <Text variant="h1" style={[styles.positionNumber, { color: getStatusColor(queueEntry.status) }]}>
              {queueEntry.position}
            </Text>
            <Text variant="caption" color="secondary">
              of {queueEntry.totalInQueue}
            </Text>
          </View>

          <View style={styles.positionDetails}>
            <View style={styles.detailRow}>
              <Text variant="caption" color="secondary">
                Estimated Wait:
              </Text>
              <Text variant="h4" style={styles.detailValue}>
                {formatTime(queueEntry.estimatedWaitTime)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text variant="caption" color="secondary">
                Expected Call Time:
              </Text>
              <Text variant="body" style={styles.detailValue}>
                {format(new Date(queueEntry.estimatedCallTime), 'h:mm a')}
              </Text>
            </View>

            {queueEntry.travelInfo && (
              <View style={styles.detailRow}>
                <Text variant="caption" color="secondary">
                  Travel Time:
                </Text>
                <Text variant="body" style={styles.detailValue}>
                  {formatTime(queueEntry.travelInfo.duration)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Professional Info */}
        {showProfessional && queueEntry.professional && (
          <View style={styles.professionalContainer}>
            <Avatar
              uri={queueEntry.professional.avatar || ''}
              name={queueEntry.professional.name || 'Professional'}
              size="sm"
            />
            <View style={styles.professionalInfo}>
              <Text variant="body" style={styles.professionalName}>
                {queueEntry.professional.name}
              </Text>
              <Text variant="caption" color="secondary">
                {queueEntry.professional.specialty}
              </Text>
            </View>
          </View>
        )}

        {/* Clinic Info */}
        {queueEntry.clinic && (
          <View style={styles.clinicInfo}>
            <Text variant="caption" color="secondary">
              📍 {queueEntry.clinic.name}
            </Text>
          </View>
        )}

        {/* Reason */}
        {queueEntry.reason && (
          <View style={styles.reasonContainer}>
            <Text variant="caption" color="secondary">
              Reason:
            </Text>
            <Text variant="body">{queueEntry.reason}</Text>
          </View>
        )}

        {/* Priority Badge */}
        {queueEntry.priority === 'urgent' && (
          <View style={styles.priorityContainer}>
            <Badge variant="error" size="sm">
              🚨 Urgent
            </Badge>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 20,
  },
  positionCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  positionNumber: {
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
  },
  positionDetails: {
    flex: 1,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailValue: {
    fontWeight: '600',
  },
  professionalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 8,
  },
  professionalInfo: {
    marginLeft: 12,
    flex: 1,
  },
  professionalName: {
    fontWeight: '600',
  },
  clinicInfo: {
    marginTop: 8,
  },
  reasonContainer: {
    marginTop: 12,
    gap: 4,
  },
  priorityContainer: {
    marginTop: 12,
  },
});

export default QueuePositionCard;
