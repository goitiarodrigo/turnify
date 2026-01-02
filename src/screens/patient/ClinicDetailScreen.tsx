// src/screens/patient/ClinicDetailScreen.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Badge from '@/components/common/Badge/Badge';
import Card from '@/components/common/Card/Card';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import ProfessionalCard from '@/components/domain/ProfessionalCard/ProfessionalCard';
import { useClinic } from '@/hooks/useClinics';
import { useProfessionalsByClinic } from '@/hooks/useProfessionals';

const ClinicDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { clinicId } = route.params as any;

  const { data: clinic, isLoading: clinicLoading } = useClinic(clinicId);
  const { data: professionals, isLoading: professionalsLoading } =
    useProfessionalsByClinic(clinicId);

  if (clinicLoading) {
    return (
      <Screen>
        <LoadingSpinner />
      </Screen>
    );
  }

  if (!clinic) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text variant="h3">Clinic not found</Text>
          <Button variant="primary" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: clinic.logo }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.backButton}>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => navigation.goBack()}
            >
              ← Back
            </Button>
          </View>
        </View>

        {/* Clinic Info */}
        <View style={styles.content}>
          {/* Title and Status */}
          <View style={styles.titleContainer}>
            <Text variant="h2" style={styles.title}>
              {clinic.name}
            </Text>
            {clinic.openNow && (
              <Badge variant="success">Open Now</Badge>
            )}
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Text variant="h3" style={styles.rating}>
              ⭐ {clinic.rating.toFixed(1)}
            </Text>
            <Text variant="body" color="secondary">
              ({clinic.reviewCount} reviews)
            </Text>
          </View>

          {/* Specialties */}
          <View style={styles.section}>
            <Text variant="h4" style={styles.sectionTitle}>
              Specialties
            </Text>
            <View style={styles.specialtiesContainer}>
              {clinic.specialties.map((specialty, index) => (
                <Badge key={index} variant="neutral">
                  {specialty}
                </Badge>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text variant="h4" style={styles.sectionTitle}>
              About
            </Text>
            <Text variant="body" color="secondary">
              {clinic.description}
            </Text>
          </View>

          {/* Contact Info */}
          <Card variant="outlined">
            <Card.Content>
              <Text variant="h4" style={styles.cardTitle}>
                Contact Information
              </Text>
              <View style={styles.contactItem}>
                <Text variant="body">📍 {clinic.address.street}</Text>
                <Text variant="body" color="secondary">
                  {clinic.address.city}, {clinic.address.state} {clinic.address.zip}
                </Text>
              </View>
              <View style={styles.contactItem}>
                <Text variant="body">📞 {clinic.contact.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <Text variant="body">✉️ {clinic.contact.email}</Text>
              </View>
              {clinic.contact.website && (
                <View style={styles.contactItem}>
                  <Text variant="body">🌐 {clinic.contact.website}</Text>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Features */}
          <View style={styles.section}>
            <Text variant="h4" style={styles.sectionTitle}>
              Features & Amenities
            </Text>
            <View style={styles.featuresGrid}>
              {clinic.features.allowsWalkIns && (
                <View style={styles.featureItem}>
                  <Text variant="body">✓ Walk-in appointments</Text>
                </View>
              )}
              {clinic.features.hasVirtualQueue && (
                <View style={styles.featureItem}>
                  <Text variant="body">✓ Virtual queue</Text>
                </View>
              )}
              {clinic.features.allowsOnlinePayment && (
                <View style={styles.featureItem}>
                  <Text variant="body">✓ Online payment</Text>
                </View>
              )}
              {clinic.features.acceptsInsurance && (
                <View style={styles.featureItem}>
                  <Text variant="body">✓ Accepts insurance</Text>
                </View>
              )}
              {clinic.features.hasParking && (
                <View style={styles.featureItem}>
                  <Text variant="body">✓ Parking available</Text>
                </View>
              )}
              {clinic.features.wheelchairAccessible && (
                <View style={styles.featureItem}>
                  <Text variant="body">✓ Wheelchair accessible</Text>
                </View>
              )}
            </View>
          </View>

          {/* Professionals */}
          <View style={styles.section}>
            <Text variant="h4" style={styles.sectionTitle}>
              Our Professionals ({clinic.professionalCount})
            </Text>
            {professionalsLoading ? (
              <LoadingSpinner />
            ) : professionals && professionals.length > 0 ? (
              professionals.map((professional) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                  showClinic={false}
                  onPress={() =>
                    navigation.navigate('ProfessionalDetail' as any, {
                      professionalId: professional.id,
                    })
                  }
                />
              ))
            ) : (
              <Text variant="body" color="secondary">
                No professionals available
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() =>
                navigation.navigate('Search' as any, { clinicId: clinic.id })
              }
            >
              Book Appointment
            </Button>
            {clinic.features.hasVirtualQueue && (
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onPress={() =>
                  navigation.navigate('JoinQueue' as any, { clinicId: clinic.id })
                }
              >
                Join Virtual Queue
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  content: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  rating: {
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cardTitle: {
    marginBottom: 12,
  },
  contactItem: {
    marginBottom: 8,
  },
  featuresGrid: {
    gap: 8,
  },
  featureItem: {
    paddingVertical: 4,
  },
  actionButtons: {
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
});

export default ClinicDetailScreen;
