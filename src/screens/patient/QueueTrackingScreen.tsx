// src/screens/patient/QueueTrackingScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, SlideInDown, BounceIn } from 'react-native-reanimated';
import { format } from 'date-fns';
import Screen from '@/components/layout/Screen/Screen';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Card from '@/components/common/Card/Card';
import QueuePositionCard from '@/components/domain/QueuePositionCard/QueuePositionCard';
import {
  useQueueEntry,
  useLeaveQueue,
  useMarkAsArrived,
  useQueueNotifications,
  useQueueCalled,
} from '@/hooks/useQueue';
import { useTheme } from '@/context/ThemeContext';

const QueueTrackingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { queueId } = route.params as any;

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const { data: queueEntry, isLoading } = useQueueEntry(queueId);
  const leaveQueueMutation = useLeaveQueue();
  const markArrivedMutation = useMarkAsArrived();

  // Listen for queue notifications
  useQueueNotifications((data) => {
    setNotificationMessage(data.message);
    setShowNotification(true);

    // Auto-hide after 5 seconds
    setTimeout(() => setShowNotification(false), 5000);
  });

  // Listen for being called
  useQueueCalled((data) => {
    Alert.alert(
      "You're Next! 🎉",
      'The professional is ready to see you now. Please proceed to the clinic.',
      [{ text: 'OK' }]
    );
  });

  const handleLeaveQueue = () => {
    Alert.alert(
      'Leave Queue?',
      'Are you sure you want to leave the queue? You will lose your position.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await leaveQueueMutation.mutateAsync(queueId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to leave queue. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleMarkArrived = async () => {
    try {
      await markArrivedMutation.mutateAsync(queueId);
      Alert.alert(
        'Arrival Confirmed! ✅',
        'Thank you for confirming. Please wait in the waiting area.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm arrival. Please try again.');
    }
  };

  const handleGetDirections = () => {
    if (!queueEntry?.clinic) return;

    const { lat, lng } = queueEntry.clinic.location || {};
    if (!lat || !lng) {
      Alert.alert('Error', 'Clinic location not available');
      return;
    }

    // Open in default maps app
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const handleUpdateStatus = (status: string) => {
    // This could be used for "On the Way" status
    console.log('Update status:', status);
  };

  if (isLoading || !queueEntry) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
          <Text variant="body" color="secondary" style={{ marginTop: 16 }}>
            Loading queue information...
          </Text>
        </View>
      </Screen>
    );
  }

  const isWaiting = queueEntry.status === 'waiting';
  const isNotified = queueEntry.status === 'notified';
  const isOnWay = queueEntry.status === 'on-way';
  const isArrived = queueEntry.status === 'arrived';
  const isCompleted = queueEntry.status === 'completed';

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <Animated.View entering={FadeIn} style={styles.header}>
          <Text variant="h2">Queue Tracking</Text>
          <Text variant="body" color="secondary">
            {format(new Date(queueEntry.joinedAt), 'MMM dd, h:mm a')}
          </Text>
        </Animated.View>

        {/* Position Card */}
        <Animated.View entering={BounceIn.delay(200)}>
          <QueuePositionCard queueEntry={queueEntry} />
        </Animated.View>

        {/* Time to Leave Notification */}
        {isNotified && (
          <Animated.View entering={SlideInDown.delay(400)}>
            <Card variant="elevated" style={styles.notificationCard}>
              <Card.Content>
                <View style={styles.notificationContent}>
                  <Text variant="h3" style={styles.notificationTitle}>
                    ⏰ Time to Leave!
                  </Text>
                  <Text variant="body" color="secondary">
                    Start heading to {queueEntry.clinic.name}. Your estimated travel time
                    is {queueEntry.travelInfo.duration} minutes.
                  </Text>
                  <View style={styles.notificationActions}>
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onPress={handleGetDirections}
                    >
                      Get Directions 🗺️
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      fullWidth
                      onPress={() => handleUpdateStatus('on-way')}
                    >
                      I'm On My Way
                    </Button>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* On the Way Status */}
        {isOnWay && (
          <Animated.View entering={FadeIn}>
            <Card variant="outlined" style={styles.statusCard}>
              <Card.Content>
                <View style={styles.statusContent}>
                  <Text variant="h4">🚗 On the Way</Text>
                  <Text variant="body" color="secondary">
                    Drive safely! We'll notify the professional of your arrival.
                  </Text>
                  <Button variant="primary" size="lg" fullWidth onPress={handleMarkArrived}>
                    I've Arrived
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Arrived Status */}
        {isArrived && (
          <Animated.View entering={FadeIn}>
            <Card variant="elevated" style={styles.arrivedCard}>
              <Card.Content>
                <View style={styles.arrivedContent}>
                  <Text variant="h3" style={styles.arrivedTitle}>
                    ✅ You've Arrived!
                  </Text>
                  <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
                    Please check in at the reception and wait in the waiting area. You'll
                    be called soon.
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Completed Status */}
        {isCompleted && (
          <Animated.View entering={FadeIn}>
            <Card variant="outlined" style={styles.completedCard}>
              <Card.Content>
                <View style={styles.completedContent}>
                  <Text variant="h3">🎉 Visit Completed</Text>
                  <Text variant="body" color="secondary" style={{ textAlign: 'center' }}>
                    Thank you for using our virtual queue service. We hope you had a great
                    experience!
                  </Text>
                  <Button
                    variant="primary"
                    onPress={() =>
                      navigation.navigate('WriteReview' as any, {
                        professionalId: queueEntry.professionalId,
                        appointmentId: queueEntry.id,
                      })
                    }
                  >
                    Write a Review
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Updates Timeline */}
        {queueEntry.updates && queueEntry.updates.length > 0 && (
          <Animated.View entering={FadeIn.delay(600)}>
            <Card variant="outlined" style={styles.updatesCard}>
              <Card.Content>
                <Text variant="h4" style={styles.updatesTitle}>
                  Recent Updates
                </Text>
                <View style={styles.timeline}>
                  {queueEntry.updates.slice(0, 5).map((update, index) => (
                    <View key={index} style={styles.timelineItem}>
                      <View style={styles.timelineDot} />
                      <View style={styles.timelineContent}>
                        <Text variant="body">{update.message}</Text>
                        <Text variant="caption" color="secondary">
                          {format(new Date(update.timestamp), 'h:mm a')}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        {/* Actions */}
        {!isCompleted && (
          <View style={styles.actions}>
            {isWaiting && (
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onPress={handleGetDirections}
              >
                View Clinic Location
              </Button>
            )}
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onPress={handleLeaveQueue}
              loading={leaveQueueMutation.isPending}
            >
              Leave Queue
            </Button>
          </View>
        )}

        {/* Floating Notification */}
        {showNotification && (
          <Animated.View entering={SlideInDown} style={styles.floatingNotification}>
            <Text variant="body" style={styles.floatingNotificationText}>
              {notificationMessage}
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  header: {
    marginBottom: 24,
  },
  notificationCard: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  notificationContent: {
    gap: 12,
  },
  notificationTitle: {
    color: '#92400E',
  },
  notificationActions: {
    gap: 12,
    marginTop: 8,
  },
  statusCard: {
    marginTop: 16,
    marginBottom: 16,
  },
  statusContent: {
    gap: 12,
  },
  arrivedCard: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  arrivedContent: {
    gap: 12,
    alignItems: 'center',
  },
  arrivedTitle: {
    color: '#065F46',
  },
  completedCard: {
    marginTop: 16,
    marginBottom: 16,
  },
  completedContent: {
    gap: 16,
    alignItems: 'center',
  },
  updatesCard: {
    marginTop: 16,
    marginBottom: 16,
  },
  updatesTitle: {
    marginBottom: 16,
  },
  timeline: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
    gap: 4,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  floatingNotification: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingNotificationText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default QueueTrackingScreen;
