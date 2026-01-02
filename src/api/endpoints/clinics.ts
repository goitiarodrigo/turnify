// src/api/endpoints/clinics.ts
/**
 * Clinics API Endpoints
 * All clinic-related API calls
 */

import apiClient, { handleApiError } from '@/api/client';
import type {
  Clinic,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
  SearchFilters,
} from '@/types/models';

// ============================================================================
// TYPES
// ============================================================================

interface ClinicFilters extends PaginationParams {
  specialty?: string;
  rating?: number;
  openNow?: boolean;
  allowsWalkIns?: boolean;
  hasVirtualQueue?: boolean;
  acceptsInsurance?: boolean;
  location?: { lat: number; lng: number };
  radius?: number;
}

interface NearbyParams {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
}

// ============================================================================
// CLINIC ENDPOINTS
// ============================================================================

/**
 * Get list of clinics with filters
 */
export const getClinics = async (
  filters?: ClinicFilters
): Promise<PaginatedResponse<Clinic>> => {
  try {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Clinic>>
    >('/clinics', {
      params: filters,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch clinics');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get single clinic by ID
 */
export const getClinic = async (clinicId: string): Promise<Clinic> => {
  try {
    const response = await apiClient.get<ApiResponse<{ clinic: Clinic }>>(
      `/clinics/${clinicId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch clinic');
    }

    return response.data.data.clinic;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Search clinics
 */
export const searchClinics = async (
  filters: SearchFilters
): Promise<Clinic[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ clinics: Clinic[] }>>(
      '/clinics/search',
      {
        params: filters,
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to search clinics');
    }

    return response.data.data.clinics;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get nearby clinics based on location
 */
export const getNearbyClinics = async (
  params: NearbyParams
): Promise<Clinic[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ clinics: Clinic[] }>>(
      '/clinics/nearby',
      {
        params,
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch nearby clinics');
    }

    return response.data.data.clinics;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get clinic reviews
 */
export const getClinicReviews = async (
  clinicId: string,
  params?: PaginationParams
): Promise<PaginatedResponse<any>> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      `/clinics/${clinicId}/reviews`,
      {
        params,
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch reviews');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get clinic specialties
 */
export const getClinicSpecialties = async (
  clinicId: string
): Promise<string[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ specialties: string[] }>>(
      `/clinics/${clinicId}/specialties`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch specialties');
    }

    return response.data.data.specialties;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get clinic photos
 */
export const getClinicPhotos = async (
  clinicId: string
): Promise<string[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ photos: string[] }>>(
      `/clinics/${clinicId}/photos`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch photos');
    }

    return response.data.data.photos;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getClinics,
  getClinic,
  searchClinics,
  getNearbyClinics,
  getClinicReviews,
  getClinicSpecialties,
  getClinicPhotos,
};

export type {
  ClinicFilters,
  NearbyParams,
};
