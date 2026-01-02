// src/constants/endpoints.ts
/**
 * API Endpoints
 * Centralized definition of all API endpoints
 */

// ============================================================================
// BASE CONFIGURATION
// ============================================================================

export const API_VERSION = 'v1';
export const API_BASE_URL = process.env.API_BASE_URL || 'https://api.mediqueue.com';
export const SOCKET_URL = process.env.SOCKET_URL || 'wss://ws.mediqueue.com';

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  SOCIAL_LOGIN: '/auth/social',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
} as const;

// ============================================================================
// USER ENDPOINTS
// ============================================================================

export const USER_ENDPOINTS = {
  ME: '/users/me',
  UPDATE_PROFILE: '/users/me',
  UPLOAD_AVATAR: '/users/me/avatar',
  DELETE_AVATAR: '/users/me/avatar',
  PREFERENCES: '/users/me/preferences',
  SECURITY: '/users/me/security',
  NOTIFICATIONS_SETTINGS: '/users/me/notifications',
  DELETE_ACCOUNT: '/users/me',
} as const;

// ============================================================================
// CLINIC ENDPOINTS
// ============================================================================

export const CLINIC_ENDPOINTS = {
  LIST: '/clinics',
  DETAIL: (clinicId: string) => `/clinics/${clinicId}`,
  SEARCH: '/clinics/search',
  NEARBY: '/clinics/nearby',
  REVIEWS: (clinicId: string) => `/clinics/${clinicId}/reviews`,
  PROFESSIONALS: (clinicId: string) => `/clinics/${clinicId}/professionals`,
  SPECIALTIES: (clinicId: string) => `/clinics/${clinicId}/specialties`,
  PHOTOS: (clinicId: string) => `/clinics/${clinicId}/photos`,
} as const;

// ============================================================================
// PROFESSIONAL ENDPOINTS
// ============================================================================

export const PROFESSIONAL_ENDPOINTS = {
  LIST: '/professionals',
  DETAIL: (professionalId: string) => `/professionals/${professionalId}`,
  SEARCH: '/professionals/search',
  AVAILABILITY: (professionalId: string) => `/professionals/${professionalId}/availability`,
  REVIEWS: (professionalId: string) => `/professionals/${professionalId}/reviews`,
  SCHEDULE: (professionalId: string) => `/professionals/${professionalId}/schedule`,
  
  // Professional-specific (requires professional role)
  DASHBOARD: '/professionals/dashboard',
  MY_SCHEDULE: '/professionals/schedule',
  MY_PATIENTS: '/professionals/patients',
  MY_STATS: '/professionals/stats',
  UPDATE_SCHEDULE: '/professionals/schedule',
  BLOCK_TIME: '/professionals/schedule/block',
} as const;

// ============================================================================
// APPOINTMENT ENDPOINTS
// ============================================================================

export const APPOINTMENT_ENDPOINTS = {
  LIST: '/appointments',
  CREATE: '/appointments',
  DETAIL: (appointmentId: string) => `/appointments/${appointmentId}`,
  UPDATE: (appointmentId: string) => `/appointments/${appointmentId}`,
  CANCEL: (appointmentId: string) => `/appointments/${appointmentId}/cancel`,
  RESCHEDULE: (appointmentId: string) => `/appointments/${appointmentId}/reschedule`,
  COMPLETE: (appointmentId: string) => `/appointments/${appointmentId}/complete`,
  NO_SHOW: (appointmentId: string) => `/appointments/${appointmentId}/no-show`,
  HISTORY: '/appointments/history',
} as const;

// ============================================================================
// QUEUE ENDPOINTS
// ============================================================================

export const QUEUE_ENDPOINTS = {
  JOIN: '/queue/join',
  ACTIVE: '/queue/active',
  DETAIL: (queueId: string) => `/queue/${queueId}`,
  UPDATE_LOCATION: (queueId: string) => `/queue/${queueId}/location`,
  UPDATE_STATUS: (queueId: string) => `/queue/${queueId}/status`,
  LEAVE: (queueId: string) => `/queue/${queueId}/leave`,
  HISTORY: '/queue/history',
  
  // Professional endpoints
  LIST: '/queue/list',
  STATUS: '/queue/status',
  NEXT: '/professionals/queue/next',
  CALL: (queueId: string) => `/queue/${queueId}/call`,
} as const;

// ============================================================================
// PAYMENT ENDPOINTS
// ============================================================================

export const PAYMENT_ENDPOINTS = {
  CREATE_INTENT: '/payments/create-intent',
  CONFIRM: '/payments/confirm',
  HISTORY: '/payments',
  DETAIL: (paymentId: string) => `/payments/${paymentId}`,
  REFUND: (paymentId: string) => `/payments/${paymentId}/refund`,
  METHODS: '/payments/methods',
  ADD_METHOD: '/payments/methods',
  DELETE_METHOD: (methodId: string) => `/payments/methods/${methodId}`,
  SET_DEFAULT: (methodId: string) => `/payments/methods/${methodId}/default`,
} as const;

// ============================================================================
// NOTIFICATION ENDPOINTS
// ============================================================================

export const NOTIFICATION_ENDPOINTS = {
  LIST: '/notifications',
  UNREAD_COUNT: '/notifications/unread-count',
  MARK_READ: (notificationId: string) => `/notifications/${notificationId}/read`,
  MARK_ALL_READ: '/notifications/read-all',
  DELETE: (notificationId: string) => `/notifications/${notificationId}`,
  SETTINGS: '/notifications/settings',
  REGISTER_TOKEN: '/notifications/register-token',
  UNREGISTER_TOKEN: '/notifications/unregister-token',
} as const;

// ============================================================================
// REVIEW ENDPOINTS
// ============================================================================

export const REVIEW_ENDPOINTS = {
  CREATE: '/reviews',
  UPDATE: (reviewId: string) => `/reviews/${reviewId}`,
  DELETE: (reviewId: string) => `/reviews/${reviewId}`,
  DETAIL: (reviewId: string) => `/reviews/${reviewId}`,
  HELPFUL: (reviewId: string) => `/reviews/${reviewId}/helpful`,
  REPORT: (reviewId: string) => `/reviews/${reviewId}/report`,
} as const;

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

export const ADMIN_ENDPOINTS = {
  // Dashboard
  DASHBOARD: '/admin/dashboard',
  ANALYTICS: '/admin/analytics',
  
  // Professionals Management
  PROFESSIONALS: '/admin/professionals',
  ADD_PROFESSIONAL: '/admin/professionals',
  UPDATE_PROFESSIONAL: (professionalId: string) => `/admin/professionals/${professionalId}`,
  DELETE_PROFESSIONAL: (professionalId: string) => `/admin/professionals/${professionalId}`,
  
  // Clinic Settings
  CLINIC_SETTINGS: '/admin/clinic/settings',
  UPDATE_SETTINGS: '/admin/clinic/settings',
  PAYMENT_SETTINGS: '/admin/clinic/payment-settings',
  
  // Specialties
  SPECIALTIES: '/admin/specialties',
  ADD_SPECIALTY: '/admin/specialties',
  UPDATE_SPECIALTY: (specialtyId: string) => `/admin/specialties/${specialtyId}`,
  DELETE_SPECIALTY: (specialtyId: string) => `/admin/specialties/${specialtyId}`,
  
  // Appointments
  APPOINTMENTS: '/admin/appointments',
  APPOINTMENT_DETAIL: (appointmentId: string) => `/admin/appointments/${appointmentId}`,
  
  // Patients
  PATIENTS: '/admin/patients',
  PATIENT_DETAIL: (patientId: string) => `/admin/patients/${patientId}`,
  
  // Reports
  GENERATE_REPORT: '/admin/reports/generate',
  EXPORT_DATA: '/admin/reports/export',
} as const;

// ============================================================================
// SUPER ADMIN ENDPOINTS
// ============================================================================

export const SUPER_ADMIN_ENDPOINTS = {
  // Dashboard
  DASHBOARD: '/superadmin/dashboard',
  SYSTEM_STATS: '/superadmin/stats',
  
  // Clinics Management
  CLINICS: '/superadmin/clinics',
  ADD_CLINIC: '/superadmin/clinics',
  UPDATE_CLINIC: (clinicId: string) => `/superadmin/clinics/${clinicId}`,
  DELETE_CLINIC: (clinicId: string) => `/superadmin/clinics/${clinicId}`,
  CLINIC_DETAIL: (clinicId: string) => `/superadmin/clinics/${clinicId}`,
  
  // System Settings
  SETTINGS: '/superadmin/settings',
  FEATURE_FLAGS: '/superadmin/feature-flags',
  
  // Users
  USERS: '/superadmin/users',
  USER_DETAIL: (userId: string) => `/superadmin/users/${userId}`,
  
  // Monitoring
  LOGS: '/superadmin/logs',
  ERRORS: '/superadmin/errors',
  PERFORMANCE: '/superadmin/performance',
  
  // Database
  BACKUPS: '/superadmin/backups',
  RESTORE: '/superadmin/restore',
} as const;

// ============================================================================
// SPECIALTY ENDPOINTS
// ============================================================================

export const SPECIALTY_ENDPOINTS = {
  LIST: '/specialties',
  DETAIL: (specialtyId: string) => `/specialties/${specialtyId}`,
  SEARCH: '/specialties/search',
} as const;

// ============================================================================
// UTILITY ENDPOINTS
// ============================================================================

export const UTILITY_ENDPOINTS = {
  HEALTH: '/health',
  VERSION: '/version',
  COUNTRIES: '/utils/countries',
  TIMEZONES: '/utils/timezones',
  LANGUAGES: '/utils/languages',
  UPLOAD: '/utils/upload',
  GEOCODE: '/utils/geocode',
  DISTANCE_MATRIX: '/utils/distance-matrix',
} as const;

// ============================================================================
// SOCKET EVENTS
// ============================================================================

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // Queue Events (Client -> Server)
  QUEUE_JOIN_ROOM: 'queue:join-room',
  QUEUE_LEAVE_ROOM: 'queue:leave-room',
  QUEUE_UPDATE_LOCATION: 'queue:update-location',
  PATIENT_ARRIVED: 'patient:arrived',
  
  // Queue Events (Server -> Client)
  QUEUE_UPDATED: 'queue:updated',
  QUEUE_NOTIFICATION: 'queue:notification',
  QUEUE_CALLED: 'queue:called',
  
  // Appointment Events
  APPOINTMENT_REMINDER: 'appointment:reminder',
  APPOINTMENT_UPDATED: 'appointment:updated',
  APPOINTMENT_CANCELLED: 'appointment:cancelled',
  
  // Professional Events
  PROFESSIONAL_STATUS: 'professional:status',
  
  // General Notifications
  NOTIFICATION: 'notification',
} as const;

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  CLINIC_ENDPOINTS,
  PROFESSIONAL_ENDPOINTS,
  APPOINTMENT_ENDPOINTS,
  QUEUE_ENDPOINTS,
  PAYMENT_ENDPOINTS,
  NOTIFICATION_ENDPOINTS,
  REVIEW_ENDPOINTS,
  ADMIN_ENDPOINTS,
  SUPER_ADMIN_ENDPOINTS,
  SPECIALTY_ENDPOINTS,
  UTILITY_ENDPOINTS,
  SOCKET_EVENTS,
};
