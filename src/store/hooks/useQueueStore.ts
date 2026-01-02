// src/store/hooks/useQueueStore.ts
/**
 * Queue Store
 * Zustand store for queue state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@/api/client';
import type {
  QueueEntry,
  QueueJoinData,
  Coordinates,
  ApiResponse,
} from '@/types/models';

// ============================================================================
// TYPES
// ============================================================================

interface QueueState {
  // State
  currentQueue: QueueEntry | null;
  isInQueue: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdate: string | null;

  // Actions
  joinQueue: (data: QueueJoinData) => Promise<QueueEntry>;
  updateQueue: (queueEntry: QueueEntry) => void;
  updateLocation: (location: Coordinates) => Promise<void>;
  updateStatus: (status: 'on-way' | 'arrived') => Promise<void>;
  leaveQueue: (reason?: string) => Promise<void>;
  refreshQueue: () => Promise<void>;
  clearQueue: () => void;
  clearError: () => void;
}

// ============================================================================
// QUEUE STORE
// ============================================================================

export const useQueueStore = create<QueueState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentQueue: null,
      isInQueue: false,
      isLoading: false,
      error: null,
      lastUpdate: null,

      // =======================================================================
      // JOIN QUEUE
      // =======================================================================

      joinQueue: async (data: QueueJoinData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<
            ApiResponse<{ queueEntry: QueueEntry }>
          >('/queue/join', data);

          if (!response.data.success || !response.data.data) {
            throw new Error('Failed to join queue');
          }

          const queueEntry = response.data.data.queueEntry;

          set({
            currentQueue: queueEntry,
            isInQueue: true,
            isLoading: false,
            error: null,
            lastUpdate: new Date().toISOString(),
          });

          return queueEntry;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to join queue',
          });
          throw error;
        }
      },

      // =======================================================================
      // UPDATE QUEUE (from external sources like Socket.IO)
      // =======================================================================

      updateQueue: (queueEntry: QueueEntry) => {
        set({
          currentQueue: queueEntry,
          isInQueue: true,
          lastUpdate: new Date().toISOString(),
        });
      },

      // =======================================================================
      // UPDATE LOCATION
      // =======================================================================

      updateLocation: async (location: Coordinates) => {
        const { currentQueue } = get();

        if (!currentQueue) {
          throw new Error('No active queue');
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.patch<
            ApiResponse<{ queueEntry: QueueEntry }>
          >(`/queue/${currentQueue.id}/location`, { location });

          if (!response.data.success || !response.data.data) {
            throw new Error('Failed to update location');
          }

          const updatedQueue = response.data.data.queueEntry;

          set({
            currentQueue: updatedQueue,
            isLoading: false,
            error: null,
            lastUpdate: new Date().toISOString(),
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update location',
          });
          throw error;
        }
      },

      // =======================================================================
      // UPDATE STATUS
      // =======================================================================

      updateStatus: async (status: 'on-way' | 'arrived') => {
        const { currentQueue } = get();

        if (!currentQueue) {
          throw new Error('No active queue');
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.patch<
            ApiResponse<{ queueEntry: QueueEntry }>
          >(`/queue/${currentQueue.id}/status`, { status });

          if (!response.data.success || !response.data.data) {
            throw new Error('Failed to update status');
          }

          const updatedQueue = response.data.data.queueEntry;

          set({
            currentQueue: updatedQueue,
            isLoading: false,
            error: null,
            lastUpdate: new Date().toISOString(),
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update status',
          });
          throw error;
        }
      },

      // =======================================================================
      // LEAVE QUEUE
      // =======================================================================

      leaveQueue: async (reason?: string) => {
        const { currentQueue } = get();

        if (!currentQueue) {
          throw new Error('No active queue');
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<ApiResponse>(
            `/queue/${currentQueue.id}/leave`,
            { reason }
          );

          if (!response.data.success) {
            throw new Error('Failed to leave queue');
          }

          set({
            currentQueue: null,
            isInQueue: false,
            isLoading: false,
            error: null,
            lastUpdate: new Date().toISOString(),
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to leave queue',
          });
          throw error;
        }
      },

      // =======================================================================
      // REFRESH QUEUE
      // =======================================================================

      refreshQueue: async () => {
        const { currentQueue } = get();

        if (!currentQueue) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.get<
            ApiResponse<{ queueEntry: QueueEntry }>
          >(`/queue/${currentQueue.id}`);

          if (!response.data.success || !response.data.data) {
            throw new Error('Failed to refresh queue');
          }

          const updatedQueue = response.data.data.queueEntry;

          set({
            currentQueue: updatedQueue,
            isLoading: false,
            error: null,
            lastUpdate: new Date().toISOString(),
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to refresh queue',
          });
          throw error;
        }
      },

      // =======================================================================
      // CLEAR QUEUE
      // =======================================================================

      clearQueue: () => {
        set({
          currentQueue: null,
          isInQueue: false,
          error: null,
        });
      },

      // =======================================================================
      // CLEAR ERROR
      // =======================================================================

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'queue-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist essential state
      partialize: (state) => ({
        currentQueue: state.currentQueue,
        isInQueue: state.isInQueue,
        lastUpdate: state.lastUpdate,
      }),
    }
  )
);

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Hook to get current queue
 */
export const useCurrentQueue = () => {
  return useQueueStore((state) => state.currentQueue);
};

/**
 * Hook to check if user is in queue
 */
export const useIsInQueue = () => {
  return useQueueStore((state) => state.isInQueue);
};

/**
 * Hook for queue loading state
 */
export const useQueueLoading = () => {
  return useQueueStore((state) => state.isLoading);
};

/**
 * Hook for queue errors
 */
export const useQueueError = () => {
  return useQueueStore((state) => state.error);
};

/**
 * Hook for queue position
 */
export const useQueuePosition = () => {
  const queue = useCurrentQueue();
  return queue?.position || 0;
};

/**
 * Hook for estimated wait time
 */
export const useEstimatedWaitTime = () => {
  const queue = useCurrentQueue();
  return queue?.estimatedWaitTime || 0;
};

/**
 * Hook for queue actions only
 */
export const useQueueActions = () => {
  return useQueueStore((state) => ({
    joinQueue: state.joinQueue,
    updateQueue: state.updateQueue,
    updateLocation: state.updateLocation,
    updateStatus: state.updateStatus,
    leaveQueue: state.leaveQueue,
    refreshQueue: state.refreshQueue,
    clearQueue: state.clearQueue,
    clearError: state.clearError,
  }));
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useQueueStore;

export type { QueueState };
