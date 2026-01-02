// src/api/endpoints/appointments.ts
/**
 * Appointments API Endpoints
 * All appointment-related API calls
 */

import apiClient, { handleApiError } from '@/api/client';
import type {
  Appointment,
  AppointmentBookingData,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
} from '@/types/models';

// ============================================================================
// TYPES
// ============================================================================

interface AppointmentFilters extends PaginationParams {
  status?: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  professionalId?: string;
  clinicId?: string;
  startDate?: string;
  endDate?: string;
}

interface AppointmentUpdateData {
  dateTime?: string;
  reason?: string;
  symptoms?: string;
  notes?: string;
}

interface AppointmentCancelData {
  reason: string;
  notes?: string;
}

interface AppointmentCompleteData {
  notes?: string;
  prescriptions?: string[];
  followUpDate?: string;
  followUpNotes?: string;
}

// ============================================================================
// APPOINTMENT ENDPOINTS
// ============================================================================

/**
 * Get list of appointments
 */
export const getAppointments = async (
  filters?: AppointmentFilters
): Promise<PaginatedResponse<Appointment>> => {
  try {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Appointment>>
    >('/appointments', {
      params: filters,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch appointments');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get single appointment by ID
 */
export const getAppointment = async (
  appointmentId: string
): Promise<Appointment> => {
  try {
    const response = await apiClient.get<ApiResponse<{ appointment: Appointment }>>(
      `/appointments/${appointmentId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch appointment');
    }

    return response.data.data.appointment;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Create new appointment
 */
export const createAppointment = async (
  data: AppointmentBookingData
): Promise<Appointment> => {
  try {
    const response = await apiClient.post<ApiResponse<{ appointment: Appointment }>>(
      '/appointments',
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to create appointment');
    }

    return response.data.data.appointment;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update appointment
 */
export const updateAppointment = async (
  appointmentId: string,
  data: AppointmentUpdateData
): Promise<Appointment> => {
  try {
    const response = await apiClient.patch<ApiResponse<{ appointment: Appointment }>>(
      `/appointments/${appointmentId}`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to update appointment');
    }

    return response.data.data.appointment;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (
  appointmentId: string,
  data: AppointmentCancelData
): Promise<{
  appointment: Appointment;
  refund?: {
    amount: number;
    status: string;
  };
}> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{
        appointment: Appointment;
        refund?: { amount: number; status: string };
      }>
    >(`/appointments/${appointmentId}/cancel`, data);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to cancel appointment');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Reschedule appointment
 */
export const rescheduleAppointment = async (
  appointmentId: string,
  newDateTime: string
): Promise<Appointment> => {
  try {
    const response = await apiClient.post<ApiResponse<{ appointment: Appointment }>>(
      `/appointments/${appointmentId}/reschedule`,
      { dateTime: newDateTime }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to reschedule appointment');
    }

    return response.data.data.appointment;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Complete appointment (Professional only)
 */
export const completeAppointment = async (
  appointmentId: string,
  data: AppointmentCompleteData
): Promise<Appointment> => {
  try {
    const response = await apiClient.post<ApiResponse<{ appointment: Appointment }>>(
      `/appointments/${appointmentId}/complete`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to complete appointment');
    }

    return response.data.data.appointment;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Mark appointment as no-show (Professional only)
 */
export const markNoShow = async (appointmentId: string): Promise<Appointment> => {
  try {
    const response = await apiClient.post<ApiResponse<{ appointment: Appointment }>>(
      `/appointments/${appointmentId}/no-show`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to mark as no-show');
    }

    return response.data.data.appointment;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get appointment history
 */
export const getAppointmentHistory = async (
  filters?: PaginationParams
): Promise<PaginatedResponse<Appointment>> => {
  try {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Appointment>>
    >('/appointments/history', {
      params: filters,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch appointment history');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  rescheduleAppointment,
  completeAppointment,
  markNoShow,
  getAppointmentHistory,
};

export type {
  AppointmentFilters,
  AppointmentUpdateData,
  AppointmentCancelData,
  AppointmentCompleteData,
};
