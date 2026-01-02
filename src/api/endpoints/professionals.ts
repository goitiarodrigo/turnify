// src/api/endpoints/professionals.ts
/**
 * Professionals API Endpoints
 * All professional-related API calls
 */

import apiClient, { handleApiError } from '@/api/client';
import type {
  Professional,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
  DayAvailability,
  SearchFilters,
} from '@/types/models';

// ============================================================================
// TYPES
// ============================================================================

interface ProfessionalFilters extends PaginationParams {
  specialty?: string;
  clinicId?: string;
  rating?: number;
  availableToday?: boolean;
  acceptsInsurance?: boolean;
  location?: { lat: number; lng: number };
  radius?: number;
  languages?: string[];
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  priceRange?: { min: number; max: number };
}

interface AvailabilityParams {
  startDate: string;
  endDate: string;
  duration?: number;
}

// ============================================================================
// PROFESSIONAL ENDPOINTS
// ============================================================================

/**
 * Get list of professionals with filters
 */
export const getProfessionals = async (
  filters?: ProfessionalFilters
): Promise<PaginatedResponse<Professional>> => {
  try {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Professional>>
    >('/professionals', {
      params: filters,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch professionals');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get single professional by ID
 */
export const getProfessional = async (
  professionalId: string
): Promise<Professional> => {
  try {
    const response = await apiClient.get<ApiResponse<{ professional: Professional }>>(
      `/professionals/${professionalId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch professional');
    }

    return response.data.data.professional;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Search professionals
 */
export const searchProfessionals = async (
  filters: SearchFilters
): Promise<Professional[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ professionals: Professional[] }>>(
      '/professionals/search',
      {
        params: filters,
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to search professionals');
    }

    return response.data.data.professionals;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get professional availability
 */
export const getProfessionalAvailability = async (
  professionalId: string,
  params: AvailabilityParams
): Promise<DayAvailability[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ availability: DayAvailability[] }>>(
      `/professionals/${professionalId}/availability`,
      {
        params,
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch availability');
    }

    return response.data.data.availability;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get professional reviews
 */
export const getProfessionalReviews = async (
  professionalId: string,
  params?: PaginationParams
): Promise<PaginatedResponse<any>> => {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      `/professionals/${professionalId}/reviews`,
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
 * Get professional schedule
 */
export const getProfessionalSchedule = async (
  professionalId: string
): Promise<any> => {
  try {
    const response = await apiClient.get<ApiResponse<{ schedule: any }>>(
      `/professionals/${professionalId}/schedule`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch schedule');
    }

    return response.data.data.schedule;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get professionals by clinic
 */
export const getProfessionalsByClinic = async (
  clinicId: string
): Promise<Professional[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{ professionals: Professional[] }>>(
      `/clinics/${clinicId}/professionals`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch clinic professionals');
    }

    return response.data.data.professionals;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getProfessionals,
  getProfessional,
  searchProfessionals,
  getProfessionalAvailability,
  getProfessionalReviews,
  getProfessionalSchedule,
  getProfessionalsByClinic,
};

export type {
  ProfessionalFilters,
  AvailabilityParams,
};
