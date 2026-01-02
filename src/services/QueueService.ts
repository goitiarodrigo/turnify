// src/services/QueueService.ts
/**
 * Queue Service
 * Handles virtual queue business logic and real-time updates
 */

import SocketService from './SocketService';
import * as queueAPI from '@/api/endpoints/queue';
import type { QueueEntry, QueueJoinData, Coordinates } from '@/types/models';

class QueueService {
  private currentQueueEntry: QueueEntry | null = null;
  private locationUpdateInterval: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  // ============================================================================
  // QUEUE MANAGEMENT
  // ============================================================================

  /**
   * Join a virtual queue
   */
  async joinQueue(data: QueueJoinData): Promise<QueueEntry> {
    const queueEntry = await queueAPI.joinQueue(data);
    this.currentQueueEntry = queueEntry;

    // Join socket room for real-time updates
    this.joinSocketRoom(queueEntry.id);

    // Start location tracking
    this.startLocationTracking(queueEntry.id);

    return queueEntry;
  }

  /**
   * Leave current queue
   */
  async leaveQueue(queueId?: string): Promise<void> {
    const id = queueId || this.currentQueueEntry?.id;

    if (!id) {
      throw new Error('No active queue entry');
    }

    await queueAPI.leaveQueue(id);

    // Cleanup
    this.leaveSocketRoom(id);
    this.stopLocationTracking();
    this.currentQueueEntry = null;
  }

  /**
   * Get active queue entry
   */
  async getActiveQueue(): Promise<QueueEntry | null> {
    const queueEntry = await queueAPI.getActiveQueueEntry();

    if (queueEntry) {
      this.currentQueueEntry = queueEntry;
      this.joinSocketRoom(queueEntry.id);
    }

    return queueEntry;
  }

  /**
   * Update queue status
   */
  async updateStatus(
    queueId: string,
    status: QueueEntry['status']
  ): Promise<QueueEntry> {
    const updatedEntry = await queueAPI.updateQueueStatus(queueId, { status });

    if (this.currentQueueEntry?.id === queueId) {
      this.currentQueueEntry = updatedEntry;
    }

    return updatedEntry;
  }

  /**
   * Mark as arrived at clinic
   */
  async markAsArrived(queueId: string): Promise<QueueEntry> {
    const updatedEntry = await this.updateStatus(queueId, 'arrived');
    this.stopLocationTracking();

    // Notify via socket
    SocketService.emit('patient:arrived', { queueId });

    return updatedEntry;
  }

  // ============================================================================
  // LOCATION TRACKING
  // ============================================================================

  /**
   * Start tracking user location
   */
  private startLocationTracking(queueId: string): void {
    // Update location every 30 seconds
    this.locationUpdateInterval = setInterval(() => {
      this.updateLocation(queueId);
    }, 30000);

    // Initial update
    this.updateLocation(queueId);
  }

  /**
   * Stop location tracking
   */
  private stopLocationTracking(): void {
    if (this.locationUpdateInterval) {
      clearInterval(this.locationUpdateInterval);
      this.locationUpdateInterval = null;
    }
  }

  /**
   * Update current location
   */
  private async updateLocation(queueId: string): Promise<void> {
    try {
      // Get current location (would use Geolocation API in production)
      const location = await this.getCurrentLocation();

      if (location) {
        await queueAPI.updateQueueLocation(queueId, {
          location,
          travelMode: 'driving',
        });
      }
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  }

  /**
   * Get current device location
   */
  private async getCurrentLocation(): Promise<Coordinates | null> {
    // This is a placeholder - in production, use @react-native-community/geolocation
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Geolocation error:', error);
            resolve(null);
          }
        );
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Calculate estimated travel time
   */
  calculateTravelTime(
    from: Coordinates,
    to: Coordinates,
    mode: 'driving' | 'walking' | 'transit' | 'bicycling' = 'driving'
  ): number {
    // Simple distance calculation (Haversine formula)
    const R = 6371; // Earth radius in km
    const dLat = this.toRad(to.lat - from.lat);
    const dLng = this.toRad(to.lng - from.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(from.lat)) *
        Math.cos(this.toRad(to.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    // Estimate time based on mode
    const speeds = {
      driving: 40, // km/h
      walking: 5,
      transit: 30,
      bicycling: 15,
    };

    const timeInHours = distance / speeds[mode];
    return Math.ceil(timeInHours * 60); // Convert to minutes
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // ============================================================================
  // SOCKET MANAGEMENT
  // ============================================================================

  /**
   * Join socket room for queue updates
   */
  private joinSocketRoom(queueId: string): void {
    SocketService.emit('queue:join-room', { queueId });

    // Listen for queue updates
    SocketService.on('queue:updated', this.handleQueueUpdate);
    SocketService.on('queue:notification', this.handleQueueNotification);
    SocketService.on('queue:called', this.handleQueueCalled);
  }

  /**
   * Leave socket room
   */
  private leaveSocketRoom(queueId: string): void {
    SocketService.emit('queue:leave-room', { queueId });
    SocketService.off('queue:updated', this.handleQueueUpdate);
    SocketService.off('queue:notification', this.handleQueueNotification);
    SocketService.off('queue:called', this.handleQueueCalled);
  }

  /**
   * Handle queue update from socket
   */
  private handleQueueUpdate = (data: any): void => {
    if (this.currentQueueEntry && data.queueId === this.currentQueueEntry.id) {
      // Update local queue entry
      this.currentQueueEntry = {
        ...this.currentQueueEntry,
        position: data.position || this.currentQueueEntry.position,
        estimatedWaitTime: data.estimatedWaitTime || this.currentQueueEntry.estimatedWaitTime,
        estimatedCallTime: data.estimatedCallTime || this.currentQueueEntry.estimatedCallTime,
        status: data.status || this.currentQueueEntry.status,
      };

      // Notify listeners
      this.notifyListeners('update', this.currentQueueEntry);
    }
  };

  /**
   * Handle queue notification from socket
   */
  private handleQueueNotification = (data: any): void => {
    this.notifyListeners('notification', data);
  };

  /**
   * Handle queue called from socket
   */
  private handleQueueCalled = (data: any): void => {
    if (this.currentQueueEntry && data.queueId === this.currentQueueEntry.id) {
      this.notifyListeners('called', data);
    }
  };

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================

  /**
   * Add event listener
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: (data: any) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Notify all listeners of an event
   */
  private notifyListeners(event: string, data: any): void {
    this.listeners.get(event)?.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in queue listener:', error);
      }
    });
  }

  // ============================================================================
  // CLEANUP
  // ============================================================================

  /**
   * Cleanup all resources
   */
  cleanup(): void {
    this.stopLocationTracking();

    if (this.currentQueueEntry) {
      this.leaveSocketRoom(this.currentQueueEntry.id);
    }

    this.listeners.clear();
    this.currentQueueEntry = null;
  }
}

export default new QueueService();
