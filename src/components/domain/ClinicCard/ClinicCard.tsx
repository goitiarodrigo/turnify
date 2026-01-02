import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Clinic } from '@/types/models';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/common/Card/Card';
import Text from '@/components/common/Text/Text';
import Badge from '@/components/common/Badge/Badge';

interface ClinicCardProps {
  clinic: Clinic;
  onPress?: () => void;
  showDistance?: boolean;
}

const ClinicCard: React.FC<ClinicCardProps> = ({
  clinic,
  onPress,
  showDistance = true,
}) => {
  const { theme } = useTheme();

  return (
    <Card variant="elevated" onPress={onPress}>
      <Card.Content>
        <View style={styles.container}>
          {/* Clinic Image */}
          <Image
            source={{ uri: clinic.logo }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Clinic Info */}
          <View style={styles.content}>
            <View style={styles.header}>
              <Text variant="h4" numberOfLines={1} style={styles.name}>
                {clinic.name}
              </Text>
              {clinic.openNow && (
                <Badge variant="success" size="sm">
                  Open
                </Badge>
              )}
            </View>

            {/* Specialties */}
            {clinic.specialties.length > 0 && (
              <Text variant="caption" color="secondary" numberOfLines={1}>
                {clinic.specialties.slice(0, 3).join(' • ')}
              </Text>
            )}

            {/* Rating and Distance */}
            <View style={styles.metadata}>
              <View style={styles.rating}>
                <Text variant="body" style={styles.ratingText}>
                  ⭐ {clinic.rating.toFixed(1)}
                </Text>
                <Text variant="caption" color="secondary">
                  ({clinic.reviewCount})
                </Text>
              </View>

              {showDistance && clinic.distance !== undefined && (
                <Text variant="caption" color="secondary">
                  📍 {clinic.distance.toFixed(1)} km
                </Text>
              )}
            </View>

            {/* Address */}
            <Text variant="caption" color="secondary" numberOfLines={1}>
              {clinic.address.street}, {clinic.address.city}
            </Text>

            {/* Features */}
            <View style={styles.features}>
              {clinic.features.allowsWalkIns && (
                <Badge variant="neutral" size="sm">
                  Walk-ins
                </Badge>
              )}
              {clinic.features.hasVirtualQueue && (
                <Badge variant="info" size="sm">
                  Virtual Queue
                </Badge>
              )}
              {clinic.features.allowsOnlinePayment && (
                <Badge variant="neutral" size="sm">
                  Online Pay
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
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
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
  name: {
    flex: 1,
    marginRight: 8,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
    gap: 12,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '600',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
});

export default ClinicCard;
