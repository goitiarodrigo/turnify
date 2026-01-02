// src/hooks/useQueue.ts
/**
 * useQueue Hook
 * React Query hooks for queue data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import * as queueAPI from '@/api/endpoints/queue';
import QueueService from '@/services/QueueService';
import type { QueueEntry, QueueJoinData } from '@/types/models';
import type { QueueFilters } from '@/api/endpoints/queue';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const queueKeys = {
  all: ['queue'] as const,
  active: () => [...queueKeys.all, 'active'] as const,
  detail: (id: string) => [...queueKeys.all, 'detail', id] as const,
  history: () => [...queueKeys.all, 'history'] as const,
  list: (filters: QueueFilters) => [...queueKeys.all, 'list', filters] as const,
  status: () => [...queueKeys.all, 'status'] as const,
};

// ============================================================================
// PATIENT HOOKS
// ============================================================================

/**
 * Hook to get active queue entry
 */
export const useActiveQueue = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queueKeys.active(),
    queryFn: () => QueueService.getActiveQueue(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  // Listen for real-time updates
  useEffect(() => {
    const handleUpdate = (queueEntry: QueueEntry) => {
      queryClient.setQueryData(queueKeys.active(), queueEntry);
    };

    QueueService.on('update', handleUpdate);

    return () => {
      QueueService.off('update', handleUpdate);
    };
  }, [queryClient]);

  return query;
};

/**
 * Hook to get queue entry details
 */
export const useQueueEntry = (queueId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queueKeys.detail(queueId),
    queryFn: () => queueAPI.getQueueEntry(queueId),
    enabled: !!queueId,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Listen for real-time updates
  useEffect(() => {
    if (!queueId) return;

    const handleUpdate = (queueEntry: QueueEntry) => {
      if (queueEntry.id === queueId) {
        queryClient.setQueryData(queueKeys.detail(queueId), queueEntry);
      }
    };

    QueueService.on('update', handleUpdate);

    return () => {
      QueueService.off('update', handleUpdate);
    };
  }, [queueId, queryClient]);

  return query;
};

/**
 * Hook to join queue
 */
export const useJoinQueue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QueueJoinData) => QueueService.joinQueue(data),
    onSuccess: (queueEntry) => {
      // Update active queue
      queryClient.setQueryData(queueKeys.active(), queueEntry);
      // Update detail cache
      queryClient.setQueryData(queueKeys.detail(queueEntry.id), queueEntry);
      // Invalidate history
      queryClient.invalidateQueries({ queryKey: queueKeys.history() });
    },
  });
};

/**
 * Hook to leave queue
 */
export const useLeaveQueue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (queueId?: string) => QueueService.leaveQueue(queueId),
    onSuccess: () => {
      // Clear active queue
      queryClient.setQueryData(queueKeys.active(), null);
      // Invalidate all queue data
      queryClient.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
};

/**
 * Hook to update queue status
 */
export const useUpdateQueueStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      queueId,
      status,
    }: {
      queueId: string;
      status: QueueEntry['status'];
    }) => QueueService.updateStatus(queueId, status),
    onSuccess: (queueEntry) => {
      // Update caches
      queryClient.setQueryData(queueKeys.active(), queueEntry);
      queryClient.setQueryData(queueKeys.detail(queueEntry.id), queueEntry);
    },
  });
};

/**
 * Hook to mark as arrived
 */
export const useMarkAsArrived = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (queueId: string) => QueueService.markAsArrived(queueId),
    onSuccess: (queueEntry) => {
      queryClient.setQueryData(queueKeys.active(), queueEntry);
      queryClient.setQueryData(queueKeys.detail(queueEntry.id), queueEntry);
    },
  });
};

/**
 * Hook to get queue history
 */
export const useQueueHistory = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: [...queueKeys.history(), page, limit],
    queryFn: () => queueAPI.getQueueHistory({ page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============================================================================
// PROFESSIONAL HOOKS
// ============================================================================

/**
 * Hook to get queue list (Professional only)
 */
export const useQueueList = (filters?: QueueFilters) => {
  return useQuery({
    queryKey: queueKeys.list(filters || {}),
    queryFn: () => queueAPI.getQueueList(filters),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
};

/**
 * Hook to get queue status (Professional only)
 */
export const useQueueStatus = () => {
  return useQuery({
    queryKey: queueKeys.status(),
    queryFn: () => queueAPI.getQueueStatus(),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
};

/**
 * Hook to call next patient (Professional only)
 */
export const useCallNextPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => queueAPI.callNextPatient(),
    onSuccess: () => {
      // Invalidate queue list and status
      queryClient.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
};

/**
 * Hook to call specific patient (Professional only)
 */
export const useCallPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (queueId: string) => queueAPI.callPatient(queueId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queueKeys.all });
    },
  });
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to listen for queue notifications
 */
export const useQueueNotifications = (
  callback: (data: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    QueueService.on('notification', callback);

    return () => {
      QueueService.off('notification', callback);
    };
  }, [callback, enabled]);
};

/**
 * Hook to listen for being called
 */
export const useQueueCalled = (
  callback: (data: any) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    QueueService.on('called', callback);

    return () => {
      QueueService.off('called', callback);
    };
  }, [callback, enabled]);
};

/**
 * Hook to invalidate queue cache
 */
export const useInvalidateQueue = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queueKeys.all });
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useActiveQueue;

export type { QueueFilters };
