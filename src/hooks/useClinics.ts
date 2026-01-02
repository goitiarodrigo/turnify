// src/hooks/useClinics.ts
/**
 * useClinics Hook
 * React Query hooks for clinic data management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/client';
import type { Clinic, PaginatedResponse, ApiResponse } from '@/types/models';

// ============================================================================
// TYPES
// ============================================================================

interface ClinicsFilters {
  search?: string;
  specialty?: string;
  location?: { lat: number; lng: number };
  radius?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// QUERY KEYS
// ============================================================================

export const clinicsKeys = {
  all: ['clinics'] as const,
  lists: () => [...clinicsKeys.all, 'list'] as const,
  list: (filters: ClinicsFilters) => [...clinicsKeys.lists(), filters] as const,
  details: () => [...clinicsKeys.all, 'detail'] as const,
  detail: (id: string) => [...clinicsKeys.details(), id] as const,
  nearby: (lat: number, lng: number, radius: number) =>
    [...clinicsKeys.all, 'nearby', lat, lng, radius] as const,
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

const getClinics = async (filters?: ClinicsFilters): Promise<PaginatedResponse<Clinic>> => {
  const response = await apiClient.get<ApiResponse<PaginatedResponse<Clinic>>>(
    '/clinics',
    { params: filters }
  );
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Failed to fetch clinics');
  }
  
  return response.data.data;
};

const getClinic = async (clinicId: string): Promise<Clinic> => {
  const response = await apiClient.get<ApiResponse<{ clinic: Clinic }>>(
    `/clinics/${clinicId}`
  );
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Failed to fetch clinic');
  }
  
  return response.data.data.clinic;
};

const getNearbyClinics = async (
  lat: number,
  lng: number,
  radius: number = 10
): Promise<Clinic[]> => {
  const response = await apiClient.get<ApiResponse<{ clinics: Clinic[] }>>(
    '/clinics/nearby',
    {
      params: { lat, lng, radius },
    }
  );
  
  if (!response.data.success || !response.data.data) {
    throw new Error('Failed to fetch nearby clinics');
  }
  
  return response.data.data.clinics;
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to get list of clinics with filters
 */
export const useClinics = (filters?: ClinicsFilters) => {
  return useQuery({
    queryKey: clinicsKeys.list(filters || {}),
    queryFn: () => getClinics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get single clinic details
 */
export const useClinic = (clinicId: string) => {
  return useQuery({
    queryKey: clinicsKeys.detail(clinicId),
    queryFn: () => getClinic(clinicId),
    enabled: !!clinicId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get nearby clinics based on location
 */
export const useNearbyClinics = (
  lat: number,
  lng: number,
  radius?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: clinicsKeys.nearby(lat, lng, radius || 10),
    queryFn: () => getNearbyClinics(lat, lng, radius),
    enabled: enabled && !!lat && !!lng,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

/**
 * Hook to search clinics
 */
export const useSearchClinics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (filters: ClinicsFilters) => getClinics(filters),
    onSuccess: (data, variables) => {
      // Update cache with search results
      queryClient.setQueryData(clinicsKeys.list(variables), data);
    },
  });
};

/**
 * Hook to prefetch clinic details
 */
export const usePrefetchClinic = () => {
  const queryClient = useQueryClient();

  return (clinicId: string) => {
    queryClient.prefetchQuery({
      queryKey: clinicsKeys.detail(clinicId),
      queryFn: () => getClinic(clinicId),
      staleTime: 5 * 60 * 1000,
    });
  };
};

/**
 * Hook to invalidate clinics cache
 */
export const useInvalidateClinics = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: clinicsKeys.all });
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default useClinics;

export type { ClinicsFilters };
