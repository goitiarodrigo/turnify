import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Professional } from '@/types/models';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/common/Card/Card';
import Avatar from '@/components/common/Avatar/Avatar';
import Text from '@/components/common/Text/Text';
import Badge from '@/components/common/Badge/Badge';

interface ProfessionalCardProps {
  professional: Professional;
  onPress?: () => void;
  showClinic?: boolean;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  onPress,
  showClinic = true,
}) => {
  const { theme } = useTheme();

  const getAvailabilityBadge = () => {
    if (!professional.availability.hasQueueOpen && !professional.availability.nextAvailable) {
      return { variant: 'neutral' as const, text: 'Unavailable' };
    }
    if (professional.availability.hasQueueOpen) {
      return { variant: 'success' as const, text: 'Queue Open' };
    }
    if (professional.availability.nextAvailable) {
      return { variant: 'info' as const, text: 'Book Ahead' };
    }
    return { variant: 'neutral' as const, text: 'Unavailable' };
  };

  const availabilityBadge = getAvailabilityBadge();

  return (
    <Card variant="elevated" onPress={onPress}>
      <Card.Content>
        <View style={styles.container}>
          {/* Professional Avatar */}
          <Avatar
            uri={professional.avatar}
            name={professional.name}
            size="lg"
          />

          {/* Professional Info */}
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.nameContainer}>
                <Text variant="h4" numberOfLines={1}>
                  {professional.name}
                </Text>
                {professional.credentials.boardCertified && (
                  <Text variant="caption" color="primary" style={styles.verified}>
                    ✓ Certified
                  </Text>
                )}
              </View>
              <Badge variant={availabilityBadge.variant} size="sm">
                {availabilityBadge.text}
              </Badge>
            </View>

            {/* Specialty */}
            <Text variant="body" color="secondary" numberOfLines={1}>
              {professional.specialty}
            </Text>

            {/* Experience */}
            <Text variant="caption" color="secondary">
              {professional.yearsExperience} years experience
            </Text>

            {/* Rating and Reviews */}
            <View style={styles.metadata}>
              <View style={styles.rating}>
                <Text variant="body" style={styles.ratingText}>
                  ⭐ {professional.rating.toFixed(1)}
                </Text>
                <Text variant="caption" color="secondary">
                  ({professional.reviewCount} reviews)
                </Text>
              </View>
            </View>

            {/* Clinic Info */}
            {showClinic && professional.clinic && (
              <Text variant="caption" color="secondary" numberOfLines={1}>
                📍 {professional.clinic.name}
                {professional.clinic.distance !== undefined &&
                  ` • ${professional.clinic.distance.toFixed(1)} km`
                }
              </Text>
            )}

            {/* Consultation Fee */}
            <View style={styles.footer}>
              <Text variant="body" style={styles.fee}>
                ${professional.consultationFee.min}
                {professional.consultationFee.min !== professional.consultationFee.max &&
                  ` - $${professional.consultationFee.max}`
                }
              </Text>
              {professional.consultationFee.acceptsInsurance && (
                <Badge variant="neutral" size="sm">
                  Insurance
                </Badge>
              )}
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  nameContainer: {
    flex: 1,
    marginRight: 8,
  },
  verified: {
    marginTop: 2,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  fee: {
    fontWeight: '600',
  },
});

export default ProfessionalCard;
