// src/screens/patient/NotificationsScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import Screen from '@/components/layout/Screen/Screen';
import Text from '@/components/common/Text/Text';
import Button from '@/components/common/Button/Button';
import Card from '@/components/common/Card/Card';
import Badge from '@/components/common/Badge/Badge';

// Mock notifications
const mockNotifications = [
  {
    id: '1',
    type: 'appointment_reminder',
    title: 'Appointment Reminder',
    message: 'Your appointment with Dr. Smith is tomorrow at 2:00 PM',
    read: false,
    createdAt: new Date().toISOString(),
    data: { appointmentId: '123' },
  },
  {
    id: '2',
    type: 'queue_update',
    title: 'Queue Position Update',
    message: 'You are now #3 in the queue',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    data: { queueId: '456' },
  },
  {
    id: '3',
    type: 'payment_received',
    title: 'Payment Confirmed',
    message: 'Your payment of $75.00 has been processed',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch new notifications
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationPress = (notification: typeof mockNotifications[0]) => {
    // Mark as read
    setNotifications(notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    ));

    // Navigate to relevant screen
    if (notification.data?.appointmentId) {
      navigation.navigate('AppointmentDetail' as any, {
        appointmentId: notification.data.appointmentId,
      });
    } else if (notification.data?.queueId) {
      navigation.navigate('QueueTracking' as any, {
        queueId: notification.data.queueId,
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_reminder':
        return '📅';
      case 'appointment_confirmed':
        return '✅';
      case 'appointment_cancelled':
        return '❌';
      case 'queue_update':
        return '🔔';
      case 'payment_received':
        return '💳';
      case 'review_request':
        return '⭐';
      default:
        return '📬';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="h2">Notifications</Text>
            {unreadCount > 0 && (
              <Text variant="caption" color="secondary">
                {unreadCount} unread
              </Text>
            )}
          </View>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onPress={handleMarkAllRead}>
              Mark all read
            </Button>
          )}
        </View>

        {/* Notifications List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text variant="h3" style={styles.emptyTitle}>
                No Notifications
              </Text>
              <Text variant="body" color="secondary">
                You're all caught up!
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <Card
                    variant="outlined"
                    style={[
                      styles.notificationCard,
                      !notification.read && styles.unreadCard,
                    ]}
                  >
                    <Card.Content>
                      <View style={styles.notificationContent}>
                        <View style={styles.notificationIcon}>
                          <Text style={styles.iconText}>
                            {getNotificationIcon(notification.type)}
                          </Text>
                        </View>
                        <View style={styles.notificationBody}>
                          <View style={styles.notificationHeader}>
                            <Text variant="body" style={styles.notificationTitle}>
                              {notification.title}
                            </Text>
                            {!notification.read && (
                              <Badge variant="info" size="sm">
                                New
                              </Badge>
                            )}
                          </View>
                          <Text variant="body" color="secondary" style={styles.notificationMessage}>
                            {notification.message}
                          </Text>
                          <Text variant="caption" color="secondary" style={styles.notificationTime}>
                            {format(new Date(notification.createdAt), 'MMM dd, h:mm a')}
                          </Text>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    paddingTop: 64,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  notificationsList: {
    padding: 16,
    paddingTop: 0,
  },
  notificationCard: {
    marginBottom: 12,
  },
  unreadCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  notificationContent: {
    flexDirection: 'row',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  notificationBody: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  notificationMessage: {
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    marginTop: 4,
  },
});

export default NotificationsScreen;
