import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import SocketService from '@/services/SocketService';
import Screen from '@/components/layout/Screen/Screen';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import Text from '@/components/common/Text/Text';
import { Button } from '@/components/common';
import useQueueDetail from '@/hooks/useQueueDetail';
import useQueueStore from '@/store/hooks/useQueueStore';

const QueueTrackingScreen = () => {
  const route = useRoute();
  const { queueId } = route.params as any;
  const { data: queueEntry, refetch } = useQueueDetail(queueId);
  const { updatePosition } = useQueueStore() as any;

  useEffect(() => {
    // Join socket room for real-time updates
    SocketService.emit('queue:join-room', { queueId });

    // Listen for position updates
    SocketService.on('queue:updated', (data) => {
      if (data.queueId === queueId) {
        updatePosition(data);
        refetch(); // Refetch full data
      }
    });

    // Listen for notifications
    SocketService.on('queue:notification', (data) => {
      if (data.queueId === queueId) {
        // Show in-app notification
        console.log('Notification:', data.message);
      }
    });

    return () => {
      SocketService.emit('queue:leave-room', { queueId });
      SocketService.off('queue:updated');
      SocketService.off('queue:notification');
    };
  }, [queueId]);

  if (!queueEntry) {
    return <LoadingSpinner />;
  }

  return (
    <Screen>
      <Animated.View entering={FadeIn} style={styles.container}>
        <View style={{ padding: 20, backgroundColor: 'lightblue', borderRadius: 10 }}>
          <Text variant="h2">Position: {queueEntry.position}</Text>
          <Text variant="body">Total in Queue: {queueEntry.totalInQueue}</Text>
          <Text variant="body">Estimated Wait: {queueEntry.estimatedWaitTime} min</Text>
          <Text variant="body">Status: {queueEntry.status}</Text>
          <Button variant="outline" onPress={() => {}}>
            Leave Queue
          </Button>
        </View>

        {queueEntry.status === 'notified' && (
          <Animated.View entering={SlideInDown} style={styles.notification}>
            <Text variant="h3">It's time to go!</Text>
            <Text>Start heading to {queueEntry.clinic.name}</Text>
            <Button variant="primary" onPress={() => console.log('Open directions')}>
              Get Directions
            </Button>
          </Animated.View>
        )}
      </Animated.View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  notification: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
  },
});

export default QueueTrackingScreen;