import React from 'react';
import { View, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import Card from '@/components/common/Card/Card';
import Avatar from '@/components/common/Avatar/Avatar';
import Text from '@/components/common/Text/Text';
import Badge from '@/components/common/Badge/Badge';
import type { Review } from '@/types/models';

interface ReviewCardProps {
  review: Review;
  onPress?: () => void;
  showProfessional?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onPress,
  showProfessional = false,
}) => {
  const { theme } = useTheme();

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i <= rating ? '⭐' : '☆'}
        </Text>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <Card variant="outlined" onPress={onPress}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.patientInfo}>
            <Avatar
              uri={review.patient.avatar}
              name={review.patient.name}
              size="sm"
            />
            <View style={styles.patientDetails}>
              <Text variant="body" style={styles.patientName}>
                {review.patient.name}
              </Text>
              {review.verified && (
                <Badge variant="success" size="sm">
                  Verified
                </Badge>
              )}
            </View>
          </View>
          <Text variant="caption" color="secondary">
            {format(new Date(review.createdAt), 'MMM dd, yyyy')}
          </Text>
        </View>

        {/* Rating */}
        <View style={styles.ratingSection}>
          {renderStars(review.rating)}
          <Text variant="caption" color="secondary" style={styles.ratingText}>
            {review.rating}.0
          </Text>
        </View>

        {/* Comment */}
        {review.comment && (
          <Text variant="body" color="secondary" style={styles.comment}>
            {review.comment}
          </Text>
        )}

        {/* Categories (if any) */}
        {review.categories && (
          <View style={styles.categories}>
            {review.categories.professionalism !== undefined && (
              <View style={styles.categoryItem}>
                <Text variant="caption" color="secondary">
                  Professionalism:
                </Text>
                <Text variant="caption"> {review.categories.professionalism}/5</Text>
              </View>
            )}
            {review.categories.communication !== undefined && (
              <View style={styles.categoryItem}>
                <Text variant="caption" color="secondary">
                  Communication:
                </Text>
                <Text variant="caption"> {review.categories.communication}/5</Text>
              </View>
            )}
            {review.categories.waitTime !== undefined && (
              <View style={styles.categoryItem}>
                <Text variant="caption" color="secondary">
                  Wait Time:
                </Text>
                <Text variant="caption"> {review.categories.waitTime}/5</Text>
              </View>
            )}
          </View>
        )}

        {/* Response (if any) */}
        {review.response && (
          <View style={styles.response}>
            <Text variant="caption" color="secondary" style={styles.responseLabel}>
              Response from professional
            </Text>
            <Text variant="body" style={styles.responseText}>
              {review.response.text}
            </Text>
            <Text variant="caption" color="secondary">
              {format(new Date(review.response.respondedAt), 'MMM dd, yyyy')}
            </Text>
          </View>
        )}

        {/* Helpful Count */}
        {review.helpful !== undefined && review.helpful > 0 && (
          <Text variant="caption" color="secondary" style={styles.helpful}>
            {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this
            helpful
          </Text>
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
    marginBottom: 12,
  },
  patientInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  patientDetails: {
    marginLeft: 8,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  patientName: {
    fontWeight: '600',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    fontSize: 16,
  },
  ratingText: {
    fontWeight: '600',
  },
  comment: {
    lineHeight: 20,
    marginBottom: 12,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
  },
  response: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  responseLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  responseText: {
    marginBottom: 4,
    fontStyle: 'italic',
  },
  helpful: {
    marginTop: 8,
  },
});

export default ReviewCard;
