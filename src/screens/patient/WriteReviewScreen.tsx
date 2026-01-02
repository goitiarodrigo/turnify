// src/screens/patient/WriteReviewScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import Card from '@/components/common/Card/Card';
import Avatar from '@/components/common/Avatar/Avatar';
import { useProfessional } from '@/hooks/useProfessionals';

const schema = yup.object({
  comment: yup.string().required('Please write a review').min(10, 'Review must be at least 10 characters'),
});

type FormData = {
  comment: string;
};

const WriteReviewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { professionalId, appointmentId } = route.params as any;

  const [rating, setRating] = useState(0);
  const [professionalism, setProfessionalism] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [waitTime, setWaitTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data: professional } = useProfessional(professionalId);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (rating === 0) {
      Alert.alert('Required', 'Please select a rating');
      return;
    }

    try {
      setLoading(true);

      // API call would go here
      // await createReview({
      //   professionalId,
      //   appointmentId,
      //   rating,
      //   comment: data.comment,
      //   categories: {
      //     professionalism,
      //     communication,
      //     waitTime,
      //   },
      // });

      Alert.alert(
        'Thank You! 🎉',
        'Your review has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (
    value: number,
    onChange: (value: number) => void,
    size: 'large' | 'small' = 'large'
  ) => {
    const starSize = size === 'large' ? 40 : 24;
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onChange(star)}>
            <Text style={[styles.star, { fontSize: starSize }]}>
              {star <= value ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (!professional) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
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
          <Text variant="h3">Write a Review</Text>
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
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Overall Rating */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Overall Rating *
          </Text>
          <View style={styles.ratingContainer}>
            {renderStars(rating, setRating, 'large')}
            {rating > 0 && (
              <Text variant="h3" style={styles.ratingValue}>
                {rating}.0
              </Text>
            )}
          </View>
        </View>

        {/* Category Ratings */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Rate Specific Aspects
          </Text>

          <Card variant="outlined">
            <Card.Content>
              <View style={styles.categoryItem}>
                <Text variant="body" style={styles.categoryLabel}>
                  Professionalism
                </Text>
                {renderStars(professionalism, setProfessionalism, 'small')}
              </View>

              <View style={styles.categoryItem}>
                <Text variant="body" style={styles.categoryLabel}>
                  Communication
                </Text>
                {renderStars(communication, setCommunication, 'small')}
              </View>

              <View style={styles.categoryItem}>
                <Text variant="body" style={styles.categoryLabel}>
                  Wait Time
                </Text>
                {renderStars(waitTime, setWaitTime, 'small')}
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Written Review */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Your Review *
          </Text>
          <Controller
            control={control}
            name="comment"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Share your experience with this professional..."
                value={value}
                onChangeText={onChange}
                error={errors.comment?.message}
                multiline
                numberOfLines={6}
              />
            )}
          />
        </View>

        {/* Guidelines */}
        <Card variant="outlined" style={styles.guidelinesCard}>
          <Card.Content>
            <Text variant="h4" style={styles.guidelinesTitle}>
              💡 Review Guidelines
            </Text>
            <Text variant="caption" color="secondary" style={styles.guideline}>
              • Be honest and specific about your experience
            </Text>
            <Text variant="caption" color="secondary" style={styles.guideline}>
              • Focus on the professional's service quality
            </Text>
            <Text variant="caption" color="secondary" style={styles.guideline}>
              • Avoid including personal medical information
            </Text>
            <Text variant="caption" color="secondary" style={styles.guideline}>
              • Be respectful and constructive
            </Text>
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit(onSubmit)}
            loading={loading}
          >
            Submit Review
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
  },
  professionalDetails: {
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  ratingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  star: {
    fontSize: 40,
  },
  ratingValue: {
    marginTop: 12,
    color: '#3B82F6',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryLabel: {
    fontWeight: '600',
  },
  guidelinesCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#F0F9FF',
  },
  guidelinesTitle: {
    marginBottom: 12,
  },
  guideline: {
    marginBottom: 4,
    lineHeight: 18,
  },
  actions: {
    padding: 16,
    paddingBottom: 32,
  },
});

export default WriteReviewScreen;
