// src/api/endpoints/notifications.ts
/**
 * Notifications API Endpoints
 * All notification-related API calls
 */

import apiClient, { handleApiError } from '@/api/client';
import type {
  Notification,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
} from '@/types/models';

// ============================================================================
// TYPES
// ============================================================================

interface NotificationFilters extends PaginationParams {
  read?: boolean;
  type?: string;
}

interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
  appointmentReminders: boolean;
  queueUpdates: boolean;
  promotions: boolean;
}

// ============================================================================
// NOTIFICATION ENDPOINTS
// ============================================================================

/**
 * Get list of notifications
 */
export const getNotifications = async (
  filters?: NotificationFilters
): Promise<PaginatedResponse<Notification>> => {
  try {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Notification>>
    >('/notifications', {
      params: filters,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch notifications');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(
      '/notifications/unread-count'
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch unread count');
    }

    return response.data.data.count;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    const response = await apiClient.patch<ApiResponse>(
      `/notifications/${notificationId}/read`
    );

    if (!response.data.success) {
      throw new Error('Failed to mark notification as read');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      '/notifications/read-all'
    );

    if (!response.data.success) {
      throw new Error('Failed to mark all notifications as read');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    const response = await apiClient.delete<ApiResponse>(
      `/notifications/${notificationId}`
    );

    if (!response.data.success) {
      throw new Error('Failed to delete notification');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get notification settings
 */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{ settings: NotificationSettings }>
    >('/notifications/settings');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch notification settings');
    }

    return response.data.data.settings;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>
): Promise<NotificationSettings> => {
  try {
    const response = await apiClient.patch<
      ApiResponse<{ settings: NotificationSettings }>
    >('/notifications/settings', settings);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update notification settings');
    }

    return response.data.data.settings;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Register device token for push notifications
 */
export const registerPushToken = async (token: string): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      '/notifications/register-token',
      { token }
    );

    if (!response.data.success) {
      throw new Error('Failed to register push token');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Unregister device token
 */
export const unregisterPushToken = async (token: string): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse>(
      '/notifications/unregister-token',
      { token }
    );

    if (!response.data.success) {
      throw new Error('Failed to unregister push token');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationSettings,
  updateNotificationSettings,
  registerPushToken,
  unregisterPushToken,
};

export type { NotificationFilters, NotificationSettings };
