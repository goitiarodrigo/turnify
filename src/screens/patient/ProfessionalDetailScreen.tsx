// src/screens/patient/ProfessionalDetailScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '@/context/ThemeContext';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Badge from '@/components/common/Badge/Badge';
import Card from '@/components/common/Card/Card';
import Avatar from '@/components/common/Avatar/Avatar';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { useProfessional, useProfessionalReviews } from '@/hooks/useProfessionals';
import { format, addDays } from 'date-fns';

const ProfessionalDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { professionalId } = route.params as any;
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  const { data: professional, isLoading: professionalLoading } =
    useProfessional(professionalId);
  const { data: reviewsData, isLoading: reviewsLoading } =
    useProfessionalReviews(professionalId, 1, 5);

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

  const renderAboutTab = () => (
    <View>
      {/* Bio */}
      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>
          About
        </Text>
        <Text variant="body" color="secondary">
          {professional.bio}
        </Text>
      </View>

      {/* Credentials */}
      <Card variant="outlined">
        <Card.Content>
          <Text variant="h4" style={styles.cardTitle}>
            Credentials & Education
          </Text>
          <View style={styles.credentialItem}>
            <Text variant="body" style={styles.credentialLabel}>
              Degree:
            </Text>
            <Text variant="body">{professional.credentials.degree}</Text>
          </View>
          <View style={styles.credentialItem}>
            <Text variant="body" style={styles.credentialLabel}>
              Institution:
            </Text>
            <Text variant="body">{professional.credentials.institution}</Text>
          </View>
          <View style={styles.credentialItem}>
            <Text variant="body" style={styles.credentialLabel}>
              Graduation:
            </Text>
            <Text variant="body">{professional.credentials.graduationYear}</Text>
          </View>
          <View style={styles.credentialItem}>
            <Text variant="body" style={styles.credentialLabel}>
              License:
            </Text>
            <Text variant="body">
              {professional.credentials.licenseNumber} ({professional.credentials.licenseState})
            </Text>
          </View>
          {professional.credentials.boardCertified && (
            <View style={styles.credentialItem}>
              <Badge variant="success">Board Certified</Badge>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Specialties */}
      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>
          Specialties
        </Text>
        <View style={styles.specialtiesContainer}>
          <Badge variant="primary">{professional.specialty}</Badge>
          {professional.subSpecialties.map((sub, index) => (
            <Badge key={index} variant="neutral">
              {sub}
            </Badge>
          ))}
        </View>
      </View>

      {/* Languages */}
      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>
          Languages
        </Text>
        <Text variant="body" color="secondary">
          {professional.languages.join(', ')}
        </Text>
      </View>

      {/* Clinic Info */}
      <Card variant="outlined">
        <Card.Content>
          <Text variant="h4" style={styles.cardTitle}>
            Practice Location
          </Text>
          <Text variant="body">{professional.clinic.name}</Text>
          {professional.clinic.distance !== undefined && (
            <Text variant="caption" color="secondary">
              📍 {professional.clinic.distance.toFixed(1)} km away
            </Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );

  const renderReviewsTab = () => (
    <View style={styles.section}>
      {reviewsLoading ? (
        <LoadingSpinner />
      ) : reviewsData && reviewsData.data.length > 0 ? (
        reviewsData.data.map((review: any, index: number) => (
          <Card key={index} variant="outlined" style={styles.reviewCard}>
            <Card.Content>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAuthor}>
                  <Avatar
                    uri={review.patient?.avatar}
                    name={review.patient?.name || 'Anonymous'}
                    size="sm"
                  />
                  <View style={styles.reviewAuthorInfo}>
                    <Text variant="body" style={styles.reviewAuthorName}>
                      {review.patient?.name || 'Anonymous'}
                    </Text>
                    <Text variant="caption" color="secondary">
                      {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                    </Text>
                  </View>
                </View>
                <View style={styles.reviewRating}>
                  <Text variant="body">⭐ {review.rating.toFixed(1)}</Text>
                </View>
              </View>
              <Text variant="body" color="secondary" style={styles.reviewComment}>
                {review.comment}
              </Text>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Text variant="body" color="secondary">
          No reviews yet
        </Text>
      )}
    </View>
  );

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Button variant="ghost" size="sm" onPress={() => navigation.goBack()}>
            ← Back
          </Button>
        </View>

        {/* Professional Info */}
        <View style={styles.professionalInfo}>
          <Avatar uri={professional.avatar} name={professional.name} size="xl" />
          <View style={styles.professionalDetails}>
            <Text variant="h2" style={styles.name}>
              {professional.name}
            </Text>
            <Text variant="body" color="secondary">
              {professional.specialty}
            </Text>
            <Text variant="caption" color="secondary">
              {professional.yearsExperience} years of experience
            </Text>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Text variant="h4" style={styles.rating}>
                ⭐ {professional.rating.toFixed(1)}
              </Text>
              <Text variant="body" color="secondary">
                ({professional.reviewCount} reviews)
              </Text>
            </View>
          </View>
        </View>

        {/* Consultation Fee */}
        <Card variant="elevated" style={styles.feeCard}>
          <Card.Content>
            <View style={styles.feeContainer}>
              <View>
                <Text variant="caption" color="secondary">
                  Consultation Fee
                </Text>
                <Text variant="h3" style={styles.fee}>
                  ${professional.consultationFee.min}
                  {professional.consultationFee.min !== professional.consultationFee.max &&
                    ` - $${professional.consultationFee.max}`}
                </Text>
              </View>
              {professional.consultationFee.acceptsInsurance && (
                <Badge variant="success">Accepts Insurance</Badge>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Availability Status */}
        {professional.availability.hasQueueOpen && (
          <Card variant="outlined" style={styles.availabilityCard}>
            <Card.Content>
              <View style={styles.availabilityContent}>
                <View>
                  <Text variant="body" style={styles.availabilityTitle}>
                    Virtual Queue Open
                  </Text>
                  <Text variant="caption" color="secondary">
                    {professional.availability.queueLength || 0} people in queue
                  </Text>
                </View>
                <Badge variant="success">Available</Badge>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          <Button
            variant={activeTab === 'about' ? 'primary' : 'ghost'}
            onPress={() => setActiveTab('about')}
            style={styles.tabButton}
          >
            About
          </Button>
          <Button
            variant={activeTab === 'reviews' ? 'primary' : 'ghost'}
            onPress={() => setActiveTab('reviews')}
            style={styles.tabButton}
          >
            Reviews ({professional.reviewCount})
          </Button>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'about' ? renderAboutTab() : renderReviewsTab()}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={() =>
              navigation.navigate('BookAppointment' as any, {
                professionalId: professional.id,
                clinicId: professional.clinic.id,
              })
            }
          >
            Book Appointment
          </Button>
          {professional.availability.hasQueueOpen && (
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onPress={() =>
                navigation.navigate('JoinQueue' as any, {
                  professionalId: professional.id,
                  clinicId: professional.clinic.id,
                })
              }
            >
              Join Queue
            </Button>
          )}
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
    padding: 16,
  },
  professionalInfo: {
    alignItems: 'center',
    padding: 16,
  },
  professionalDetails: {
    alignItems: 'center',
    marginTop: 16,
  },
  name: {
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  rating: {
    fontWeight: '600',
  },
  feeCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fee: {
    marginTop: 4,
  },
  availabilityCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderColor: '#10B981',
  },
  availabilityContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  cardTitle: {
    marginBottom: 12,
  },
  credentialItem: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  credentialLabel: {
    fontWeight: '600',
    minWidth: 100,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reviewCard: {
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewAuthor: {
    flexDirection: 'row',
    flex: 1,
  },
  reviewAuthorInfo: {
    marginLeft: 12,
  },
  reviewAuthorName: {
    fontWeight: '600',
  },
  reviewRating: {
    marginLeft: 12,
  },
  reviewComment: {
    lineHeight: 20,
  },
  actionButtons: {
    padding: 16,
    gap: 12,
    marginTop: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
});

export default ProfessionalDetailScreen;
