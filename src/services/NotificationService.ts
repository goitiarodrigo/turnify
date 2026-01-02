// src/services/NotificationService.ts
/**
 * Notification Service
 * Handles push notifications, in-app notifications, and toasts
 */

import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import notifee, {
  AndroidImportance,
  EventType,
  AndroidStyle,
} from '@notifee/react-native';
import { registerPushToken, unregisterPushToken } from '@/api/endpoints/notifications';

// ============================================================================
// TYPES
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top' | 'bottom';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: ToastPosition;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface InAppNotificationOptions {
  title: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onPress?: () => void;
  imageUrl?: string;
}

// ============================================================================
// NOTIFICATION SERVICE CLASS
// ============================================================================

class NotificationService {
  private static instance: NotificationService;
  private fcmToken: string | null = null;
  private messageListeners: Array<(message: any) => void> = [];

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    try {
      // Request permissions
      await this.requestPermissions();

      // Get FCM token
      await this.getFCMToken();

      // Setup message handlers
      this.setupMessageHandlers();

      // Setup background handlers
      this.setupBackgroundHandlers();

      // Create notification channels (Android)
      if (Platform.OS === 'android') {
        await this.createNotificationChannels();
      }
    } catch (error) {
      console.error('Failed to initialize NotificationService:', error);
    }
  }

  // ==========================================================================
  // PERMISSIONS
  // ==========================================================================

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
      } else {
        if (+Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      }
    } catch (error) {
      console.error('Failed to request permissions:', error);
      return false;
    }
  }

  /**
   * Check if permissions are granted
   */
  async checkPermissions(): Promise<boolean> {
    try {
      const authStatus = await messaging().hasPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      console.error('Failed to check permissions:', error);
      return false;
    }
  }

  // ==========================================================================
  // FCM TOKEN
  // ==========================================================================

  /**
   * Get FCM token
   */
  async getFCMToken(): Promise<string | null> {
    try {
      if (this.fcmToken) {
        return this.fcmToken;
      }

      const token = await messaging().getToken();
      this.fcmToken = token;

      // Register token with backend
      await registerPushToken(token);

      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  /**
   * Refresh FCM token
   */
  async refreshToken(): Promise<string | null> {
    try {
      await messaging().deleteToken();
      this.fcmToken = null;
      return await this.getFCMToken();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }

  /**
   * Unregister FCM token
   */
  async unregisterToken(): Promise<void> {
    try {
      if (this.fcmToken) {
        await unregisterPushToken(this.fcmToken);
        await messaging().deleteToken();
        this.fcmToken = null;
      }
    } catch (error) {
      console.error('Failed to unregister token:', error);
    }
  }

  // ==========================================================================
  // MESSAGE HANDLERS
  // ==========================================================================

  /**
   * Setup foreground message handlers
   */
  private setupMessageHandlers(): void {
    // Foreground messages
    messaging().onMessage(async (remoteMessage) => {
      console.log('📨 Foreground message:', remoteMessage);

      // Show in-app notification
      await this.showInAppNotification({
        title: remoteMessage.notification?.title || 'New Notification',
        message: remoteMessage.notification?.body || '',
        imageUrl: remoteMessage.notification?.android?.imageUrl,
      });

      // Notify listeners
      this.notifyListeners(remoteMessage);
    });

    // Token refresh
    messaging().onTokenRefresh(async (token) => {
      console.log('🔄 Token refreshed:', token);
      this.fcmToken = token;
      await registerPushToken(token);
    });
  }

  /**
   * Setup background message handlers
   */
  private setupBackgroundHandlers(): void {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('📨 Background message:', remoteMessage);

      // Display notification
      await this.displayNotification({
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data,
      });
    });
  }

  // ==========================================================================
  // IN-APP NOTIFICATIONS
  // ==========================================================================

  /**
   * Show in-app notification (banner at top of screen)
   */
  async showInAppNotification(
    options: InAppNotificationOptions
  ): Promise<void> {
    try {
      const channelId = await notifee.createChannel({
        id: 'in-app',
        name: 'In-App Notifications',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: options.title,
        body: options.message,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
          style: options.imageUrl
            ? {
                type: AndroidStyle.BIGPICTURE,
                picture: options.imageUrl,
              }
            : undefined,
        },
        ios: {
          foregroundPresentationOptions: {
            banner: true,
            sound: true,
            badge: true,
          },
        },
      });

      // Auto dismiss after duration
      if (options.duration) {
        setTimeout(() => {
          notifee.cancelAllNotifications();
        }, options.duration);
      }
    } catch (error) {
      console.error('Failed to show in-app notification:', error);
    }
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================

  /**
   * Show toast notification
   */
  async showToast(options: ToastOptions): Promise<void> {
    try {
      const {
        message,
        type = 'info',
        duration = 3000,
        position = 'bottom',
      } = options;

      // Get color based on type
      const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      };

      const channelId = await notifee.createChannel({
        id: 'toast',
        name: 'Toast Notifications',
        importance: AndroidImportance.LOW,
      });

      await notifee.displayNotification({
        body: message,
        android: {
          channelId,
          importance: AndroidImportance.LOW,
          color: colors[type],
          smallIcon: 'ic_notification',
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          foregroundPresentationOptions: {
            banner: true,
            sound: false,
            badge: false,
          },
        },
      });

      // Auto dismiss
      setTimeout(() => {
        notifee.cancelAllNotifications();
      }, duration);
    } catch (error) {
      console.error('Failed to show toast:', error);
    }
  }

  /**
   * Show success toast
   */
  async showSuccess(message: string, duration?: number): Promise<void> {
    return this.showToast({ message, type: 'success', duration });
  }

  /**
   * Show error toast
   */
  async showError(message: string, duration?: number): Promise<void> {
    return this.showToast({ message, type: 'error', duration });
  }

  /**
   * Show warning toast
   */
  async showWarning(message: string, duration?: number): Promise<void> {
    return this.showToast({ message, type: 'warning', duration });
  }

  /**
   * Show info toast
   */
  async showInfo(message: string, duration?: number): Promise<void> {
    return this.showToast({ message, type: 'info', duration });
  }

  // ==========================================================================
  // NOTIFICATION DISPLAY
  // ==========================================================================

  /**
   * Display notification (used for background messages)
   */
  private async displayNotification(notification: {
    title: string;
    body: string;
    data?: any;
  }): Promise<void> {
    try {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: notification.title,
        body: notification.body,
        data: notification.data,
        android: {
          channelId,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.error('Failed to display notification:', error);
    }
  }

  // ==========================================================================
  // NOTIFICATION CHANNELS (Android)
  // ==========================================================================

  /**
   * Create notification channels for Android
   */
  private async createNotificationChannels(): Promise<void> {
    try {
      await notifee.createChannels([
        {
          id: 'default',
          name: 'Default Notifications',
          importance: AndroidImportance.HIGH,
        },
        {
          id: 'appointments',
          name: 'Appointments',
          importance: AndroidImportance.HIGH,
        },
        {
          id: 'queue',
          name: 'Queue Updates',
          importance: AndroidImportance.HIGH,
        },
        {
          id: 'reminders',
          name: 'Reminders',
          importance: AndroidImportance.HIGH,
        },
        {
          id: 'promotions',
          name: 'Promotions',
          importance: AndroidImportance.LOW,
        },
      ]);
    } catch (error) {
      console.error('Failed to create channels:', error);
    }
  }

  // ==========================================================================
  // MESSAGE LISTENERS
  // ==========================================================================

  /**
   * Add message listener
   */
  addMessageListener(callback: (message: any) => void): () => void {
    this.messageListeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.messageListeners = this.messageListeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(message: any): void {
    this.messageListeners.forEach((listener) => {
      try {
        listener(message);
      } catch (error) {
        console.error('Message listener error:', error);
      }
    });
  }

  // ==========================================================================
  // BADGE COUNT (iOS)
  // ==========================================================================

  /**
   * Set badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await notifee.setBadgeCount(count);
      }
    } catch (error) {
      console.error('Failed to set badge count:', error);
    }
  }

  /**
   * Clear badge count
   */
  async clearBadgeCount(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await notifee.setBadgeCount(0);
      }
    } catch (error) {
      console.error('Failed to clear badge count:', error);
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default NotificationService.getInstance();

export type { ToastOptions, InAppNotificationOptions };
