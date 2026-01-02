// src/hooks/useProfessionals.ts
/**
 * useProfessionals Hook
 * React Query hooks for professional data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as professionalsAPI from '@/api/endpoints/professionals';
import type { Professional, PaginatedResponse } from '@/types/models';
import type { ProfessionalFilters, AvailabilityParams } from '@/api/endpoints/professionals';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const professionalsKeys = {
  all: ['professionals'] as const,
  lists: () => [...professionalsKeys.all, 'list'] as const,
  list: (filters: ProfessionalFilters) => [...professionalsKeys.lists(), filters] as const,
  details: () => [...professionalsKeys.all, 'detail'] as const,
  detail: (id: string) => [...professionalsKeys.details(), id] as const,
  availability: (id: string, params: AvailabilityParams) =>
    [...professionalsKeys.all, 'availability', id, params] as const,
  reviews: (id: string) => [...professionalsKeys.all, 'reviews', id] as const,
  schedule: (id: string) => [...professionalsKeys.all, 'schedule', id] as const,
  byClinic: (clinicId: string) => [...professionalsKeys.all, 'clinic', clinicId] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to get list of professionals with filters
 */
export const useProfessionals = (filters?: ProfessionalFilters) => {
  return useQuery({
    queryKey: professionalsKeys.list(filters || {}),
    queryFn: () => professionalsAPI.getProfessionals(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get single professional details
 */
export const useProfessional = (professionalId: string) => {
  return useQuery({
    queryKey: professionalsKeys.detail(professionalId),
    queryFn: () => professionalsAPI.getProfessional(professionalId),
    enabled: !!professionalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to search professionals
 */
export const useSearchProfessionals = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: professionalsAPI.searchProfessionals,
    onSuccess: (data) => {
      // Update cache with search results
      data.forEach((professional) => {
        queryClient.setQueryData(
          professionalsKeys.detail(professional.id),
          professional
        );
      });
    },
  });
};

/**
 * Hook to get professional availability
 */
export const useProfessionalAvailability = (
  professionalId: string,
  params: AvailabilityParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: professionalsKeys.availability(professionalId, params),
    queryFn: () => professionalsAPI.getProfessionalAvailability(professionalId, params),
    enabled: enabled && !!professionalId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to get professional reviews
 */
export const useProfessionalReviews = (
  professionalId: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: [...professionalsKeys.reviews(professionalId), page, limit],
    queryFn: () => professionalsAPI.getProfessionalReviews(professionalId, { page, limit }),
    enabled: !!professionalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get professional schedule
 */
export const useProfessionalSchedule = (professionalId: string) => {
  return useQuery({
    queryKey: professionalsKeys.schedule(professionalId),
    queryFn: () => professionalsAPI.getProfessionalSchedule(professionalId),
    enabled: !!professionalId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get professionals by clinic
 */
export const useProfessionalsByClinic = (clinicId: string) => {
  return useQuery({
    queryKey: professionalsKeys.byClinic(clinicId),
    queryFn: () => professionalsAPI.getProfessionalsByClinic(clinicId),
    enabled: !!clinicId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to prefetch professional details
 */
export const usePrefetchProfessional = () => {
  const queryClient = useQueryClient();

  return (professionalId: string) => {
    queryClient.prefetchQuery({
      queryKey: professionalsKeys.detail(professionalId),
      queryFn: () => professionalsAPI.getProfessional(professionalId),
      staleTime: 5 * 60 * 1000,
    });
  };
};

/**
 * Hook to invalidate professionals cache
 */
export const useInvalidateProfessionals = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: professionalsKeys.all });
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useProfessionals;

export type { ProfessionalFilters, AvailabilityParams };
