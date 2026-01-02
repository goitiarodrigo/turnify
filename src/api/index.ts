// src/api/index.ts
/**
 * API Module Exports
 * Centralized exports for all API functionality
 */

import apiClient, {
  setAuthToken,
  setTenantId,
  clearAuthData,
  isAuthenticated,
  handleApiError,
} from './client';

// Import all endpoint modules
import appointmentsAPI from './endpoints/appointments';
import notificationsAPI from './endpoints/notifications';
import paymentsAPI from './endpoints/payments';

// ============================================================================
// AUTH API (from AuthService but exposed for direct use)
// ============================================================================

/**
 * Authentication API methods
 * Re-exported from AuthService for convenience
 */
import AuthService from '@/services/AuthService';

export const authAPI = {
  login: AuthService.login.bind(AuthService),
  register: AuthService.register.bind(AuthService),
  socialLogin: AuthService.socialLogin.bind(AuthService),
  continueAsGuest: AuthService.continueAsGuest.bind(AuthService),
  logout: AuthService.logout.bind(AuthService),
  refreshToken: AuthService.refreshToken.bind(AuthService),
  forgotPassword: AuthService.forgotPassword.bind(AuthService),
  resetPassword: AuthService.resetPassword.bind(AuthService),
  changePassword: AuthService.changePassword.bind(AuthService),
  getCurrentUser: AuthService.getCurrentUser.bind(AuthService),
  getToken: AuthService.getToken.bind(AuthService),
  isAuthenticated: AuthService.isAuthenticated.bind(AuthService),
  isGuestMode: AuthService.isGuestMode.bind(AuthService),
};

// ============================================================================
// EXPORTS
// ============================================================================

// Export API client
export { apiClient, apiClient as default };

// Export client utilities
export {
  setAuthToken,
  setTenantId,
  clearAuthData,
  isAuthenticated,
  handleApiError,
};

// Export all endpoint modules
export {
  appointmentsAPI,
  notificationsAPI,
  paymentsAPI,
};

// Export types
export type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from './client';

export type {
  AppointmentFilters,
  AppointmentUpdateData,
  AppointmentCancelData,
  AppointmentCompleteData,
} from './endpoints/appointments';

export type {
  NotificationFilters,
  NotificationSettings,
} from './endpoints/notifications';

export type {
  CreatePaymentIntentData,
  ConfirmPaymentData,
  PaymentMethodData,
  RefundData,
} from './endpoints/payments';

// ============================================================================
// CONVENIENCE API OBJECT
// ============================================================================

/**
 * Unified API object with all endpoints
 * Usage: import { api } from '@/api'; api.appointments.getAppointments();
 */
export const api = {
  auth: authAPI,
  appointments: appointmentsAPI,
  notifications: notificationsAPI,
  payments: paymentsAPI,
};
