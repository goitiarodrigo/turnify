// src/api/endpoints/queue.ts
/**
 * Queue API Endpoints
 * All virtual queue-related API calls
 */

import apiClient, { handleApiError } from '@/api/client';
import type {
  QueueEntry,
  QueueJoinData,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
  Coordinates,
  QueueStatus,
} from '@/types/models';

// ============================================================================
// TYPES
// ============================================================================

interface QueueFilters extends PaginationParams {
  status?: QueueStatus;
  professionalId?: string;
  clinicId?: string;
  date?: string;
}

interface UpdateLocationData {
  location: Coordinates;
  travelMode?: 'driving' | 'walking' | 'transit' | 'bicycling';
}

interface UpdateStatusData {
  status: QueueStatus;
}

// ============================================================================
// QUEUE ENDPOINTS (Patient)
// ============================================================================

/**
 * Join a virtual queue
 */
export const joinQueue = async (data: QueueJoinData): Promise<QueueEntry> => {
  try {
    const response = await apiClient.post<ApiResponse<{ queueEntry: QueueEntry }>>(
      '/queue/join',
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to join queue');
    }

    return response.data.data.queueEntry;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get active queue entry for current user
 */
export const getActiveQueueEntry = async (): Promise<QueueEntry | null> => {
  try {
    const response = await apiClient.get<ApiResponse<{ queueEntry: QueueEntry | null }>>(
      '/queue/active'
    );

    if (!response.data.success) {
      throw new Error('Failed to fetch active queue entry');
    }

    return response.data.data?.queueEntry || null;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get queue entry details by ID
 */
export const getQueueEntry = async (queueId: string): Promise<QueueEntry> => {
  try {
    const response = await apiClient.get<ApiResponse<{ queueEntry: QueueEntry }>>(
      `/queue/${queueId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch queue entry');
    }

    return response.data.data.queueEntry;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update user location in queue
 */
export const updateQueueLocation = async (
  queueId: string,
  data: UpdateLocationData
): Promise<QueueEntry> => {
  try {
    const response = await apiClient.patch<ApiResponse<{ queueEntry: QueueEntry }>>(
      `/queue/${queueId}/location`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update location');
    }

    return response.data.data.queueEntry;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update queue entry status
 */
export const updateQueueStatus = async (
  queueId: string,
  data: UpdateStatusData
): Promise<QueueEntry> => {
  try {
    const response = await apiClient.patch<ApiResponse<{ queueEntry: QueueEntry }>>(
      `/queue/${queueId}/status`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update status');
    }

    return response.data.data.queueEntry;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Leave/cancel queue entry
 */
export const leaveQueue = async (queueId: string): Promise<void> => {
  try {
    const response = await apiClient.post<ApiResponse<void>>(
      `/queue/${queueId}/leave`
    );

    if (!response.data.success) {
      throw new Error('Failed to leave queue');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get queue history for current user
 */
export const getQueueHistory = async (
  filters?: PaginationParams
): Promise<PaginatedResponse<QueueEntry>> => {
  try {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<QueueEntry>>
    >('/queue/history', {
      params: filters,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch queue history');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// QUEUE ENDPOINTS (Professional)
// ============================================================================

/**
 * Get queue list for professional (Professional only)
 */
export const getQueueList = async (
  filters?: QueueFilters
): Promise<QueueEntry[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ queue: QueueEntry[] }>>(
      '/queue/list',
      {
        params: filters,
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch queue list');
    }

    return response.data.data.queue;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get queue status/summary (Professional only)
 */
export const getQueueStatus = async (): Promise<{
  isOpen: boolean;
  totalInQueue: number;
  averageWaitTime: number;
  nextPatient?: QueueEntry;
}> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{
        isOpen: boolean;
        totalInQueue: number;
        averageWaitTime: number;
        nextPatient?: QueueEntry;
      }>
    >('/queue/status');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch queue status');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Call next patient in queue (Professional only)
 */
export const callNextPatient = async (): Promise<QueueEntry> => {
  try {
    const response = await apiClient.post<ApiResponse<{ queueEntry: QueueEntry }>>(
      '/professionals/queue/next'
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to call next patient');
    }

    return response.data.data.queueEntry;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Call specific patient in queue (Professional only)
 */
export const callPatient = async (queueId: string): Promise<QueueEntry> => {
  try {
    const response = await apiClient.post<ApiResponse<{ queueEntry: QueueEntry }>>(
      `/queue/${queueId}/call`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to call patient');
    }

    return response.data.data.queueEntry;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Patient endpoints
  joinQueue,
  getActiveQueueEntry,
  getQueueEntry,
  updateQueueLocation,
  updateQueueStatus,
  leaveQueue,
  getQueueHistory,

  // Professional endpoints
  getQueueList,
  getQueueStatus,
  callNextPatient,
  callPatient,
};

export type {
  QueueFilters,
  UpdateLocationData,
  UpdateStatusData,
};
