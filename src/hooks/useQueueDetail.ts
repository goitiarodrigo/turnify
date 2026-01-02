// src/hooks/useQueueDetail.ts
/**
 * useQueueDetail Hook
 * React Query hook for queue detail management with real-time updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import apiClient from '@/api/client';
import type { QueueEntry, ApiResponse, Coordinates } from '@/types/models';

// ============================================================================
// TYPES
// ============================================================================

interface UpdateLocationData {
  location: Coordinates;
}

interface UpdateStatusData {
  status: 'on-way' | 'arrived';
}

// ============================================================================
// QUERY KEYS
// ============================================================================

export const queueKeys = {
  all: ['queue'] as const,
  details: () => [...queueKeys.all, 'detail'] as const,
  detail: (id: string) => [...queueKeys.details(), id] as const,
  active: () => [...queueKeys.all, 'active'] as const,
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

const getQueueDetail = async (queueId: string): Promise<QueueEntry> => {
  const response = await apiClient.get<ApiResponse<{ queueEntry: QueueEntry }>>(
    `/queue/${queueId}`
  );
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Failed to fetch queue details');
  }
  
  return response.data.data.queueEntry;
};

const updateQueueLocation = async (
  queueId: string,
  data: UpdateLocationData
): Promise<QueueEntry> => {
  const response = await apiClient.patch<ApiResponse<{ queueEntry: QueueEntry }>>(
    `/queue/${queueId}/location`,
    data
  );
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Failed to update location');
  }
  
  return response.data.data.queueEntry;
};

const updateQueueStatus = async (
  queueId: string,
  data: UpdateStatusData
): Promise<QueueEntry> => {
  const response = await apiClient.patch<ApiResponse<{ queueEntry: QueueEntry }>>(
    `/queue/${queueId}/status`,
    data
  );
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Failed to update status');
  }
  
  return response.data.data.queueEntry;
};

const leaveQueue = async (queueId: string, reason?: string): Promise<void> => {
  const response = await apiClient.post<ApiResponse>(
    `/queue/${queueId}/leave`,
    { reason }
  );
  
  if (!response.data.success) {
    throw new Error('Failed to leave queue');
  }
};

const getActiveQueue = async (): Promise<QueueEntry | null> => {
  const response = await apiClient.get<ApiResponse<{ queueEntry: QueueEntry | null }>>(
    '/queue/active'
  );
  
  if (!response.data.success) {
    throw new Error('Failed to fetch active queue');
  }
  
  return response.data.data?.queueEntry || null;
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to get queue detail with auto-refresh
 */
export const useQueueDetail = (queueId: string, options?: {
  refetchInterval?: number;
  enabled?: boolean;
}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queueKeys.detail(queueId),
    queryFn: () => getQueueDetail(queueId),
    enabled: options?.enabled !== false && !!queueId,
    refetchInterval: options?.refetchInterval || 30000, // Default: 30 seconds
    staleTime: 10000, // 10 seconds
  });

  // Setup real-time updates listener (if using Socket.IO)
  useEffect(() => {
    if (!queueId) return;

    // Example: Subscribe to queue updates via Socket.IO
    // socket.on(`queue:${queueId}:updated`, (data) => {
    //   queryClient.setQueryData(queueKeys.detail(queueId), data);
    // });

    // return () => {
    //   socket.off(`queue:${queueId}:updated`);
    // };
  }, [queueId, queryClient]);

  return query;
};

/**
 * Hook to get active queue entry
 */
export const useActiveQueue = () => {
  return useQuery({
    queryKey: queueKeys.active(),
    queryFn: getActiveQueue,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refresh every minute
  });
};

/**
 * Hook to update queue location
 */
export const useUpdateQueueLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ queueId, location }: { queueId: string; location: Coordinates }) =>
      updateQueueLocation(queueId, { location }),
    onSuccess: (data, variables) => {
      // Update cache
      queryClient.setQueryData(queueKeys.detail(variables.queueId), data);
    },
  });
};

/**
 * Hook to update queue status
 */
export const useUpdateQueueStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ queueId, status }: { queueId: string; status: 'on-way' | 'arrived' }) =>
      updateQueueStatus(queueId, { status }),
    onSuccess: (data, variables) => {
      // Update cache
      queryClient.setQueryData(queueKeys.detail(variables.queueId), data);
    },
  });
};

/**
 * Hook to leave queue
 */
export const useLeaveQueue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ queueId, reason }: { queueId: string; reason?: string }) =>
      leaveQueue(queueId, reason),
    onSuccess: (_, variables) => {
      // Invalidate queue queries
      queryClient.invalidateQueries({ queryKey: queueKeys.detail(variables.queueId) });
      queryClient.invalidateQueries({ queryKey: queueKeys.active() });
    },
  });
};

/**
 * Hook to invalidate queue cache
 */
export const useInvalidateQueue = () => {
  const queryClient = useQueryClient();

  return (queueId?: string) => {
    if (queueId) {
      queryClient.invalidateQueries({ queryKey: queueKeys.detail(queueId) });
    } else {
      queryClient.invalidateQueries({ queryKey: queueKeys.all });
    }
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useQueueDetail;

export type { UpdateLocationData, UpdateStatusData };
