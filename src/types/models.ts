// src/types/models.ts
/**
 * Core data models for MediQueue application
 * Complete TypeScript definitions for all entities
 */

// ============================================================================
// USER MODELS
// ============================================================================

export type UserRole = 'patient' | 'professional' | 'admin' | 'superadmin';
export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  tenantId?: string;
  profile?: UserProfile;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  dateOfBirth?: string;
  gender?: Gender;
  address?: Address;
  emergencyContact?: EmergencyContact;
  medicalInfo?: MedicalInfo;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface MedicalInfo {
  bloodType?: string;
  allergies?: string[];
  currentMedications?: string[];
  conditions?: string[];
  notes?: string;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  defaultLocation?: {
    lat: number;
    lng: number;
  };
}

// ============================================================================
// CLINIC MODELS
// ============================================================================

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  specialties: string[];
  address: Address;
  location: {
    lat: number;
    lng: number;
  };
  distance?: number;
  rating: number;
  reviewCount: number;
  professionalCount: number;
  openNow: boolean;
  hours: WeeklyHours;
  photos?: string[];
  features: ClinicFeatures;
  settings: ClinicSettings;
  theme?: ClinicTheme;
  contact: ClinicContact;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicContact {
  phone: string;
  email: string;
  website?: string;
}

export interface WeeklyHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string; // "09:00"
  close: string; // "18:00"
  closed?: boolean;
}

export interface ClinicFeatures {
  allowsWalkIns: boolean;
  allowsOnlinePayment: boolean;
  hasVirtualQueue: boolean;
  acceptsInsurance: boolean;
  hasEmergencyServices: boolean;
  hasParking: boolean;
  wheelchairAccessible: boolean;
}

export interface ClinicSettings {
  cancellationDeadline: number; // hours
  allowsCancellation: boolean;
  requiresPayment: boolean;
  defaultAppointmentDuration: number; // minutes
  maxQueueSize?: number;
  autoCloseQueueAt?: string;
}

export interface ClinicTheme {
  primaryColor: string;
  secondaryColor: string;
  logo: string;
}

// ============================================================================
// PROFESSIONAL MODELS
// ============================================================================

export interface Professional {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  specialty: string;
  subSpecialties: string[];
  credentials: Credentials;
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  bio: string;
  languages: string[];
  clinic: {
    id: string;
    name: string;
    distance?: number;
  };
  availability: ProfessionalAvailability;
  consultationFee: ConsultationFee;
  schedule?: WeeklySchedule;
  appointmentDuration: number; // minutes
  status: 'active' | 'inactive' | 'on-leave';
  createdAt: string;
  updatedAt: string;
}

export interface Credentials {
  degree: string;
  institution: string;
  graduationYear: number;
  licenseNumber: string;
  licenseState: string;
  licenseExpiry?: string;
  boardCertified: boolean;
  certifications?: string[];
}

export interface ProfessionalAvailability {
  nextAvailable?: string;
  hasQueueOpen: boolean;
  queueLength?: number;
  queueStatus?: 'open' | 'paused' | 'closed';
  isOnline?: boolean;
}

export interface ConsultationFee {
  min: number;
  max: number;
  currency: string;
  acceptsInsurance: boolean;
}

export interface WeeklySchedule {
  monday?: TimeSlot[];
  tuesday?: TimeSlot[];
  wednesday?: TimeSlot[];
  thursday?: TimeSlot[];
  friday?: TimeSlot[];
  saturday?: TimeSlot[];
  sunday?: TimeSlot[];
}

export interface TimeSlot {
  start: string; // "09:00"
  end: string; // "12:00"
  type?: 'available' | 'break' | 'blocked';
}

// ============================================================================
// APPOINTMENT MODELS
// ============================================================================

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially-refunded';

export interface Appointment {
  id: string;
  confirmationNumber: string;
  status: AppointmentStatus;
  type: 'appointment' | 'walk-in';
  professionalId: string;
  professional: Partial<Professional>;
  clinicId: string;
  clinic: Partial<Clinic>;
  patientId: string;
  patient?: Partial<User>;
  dateTime: string;
  duration: number; // minutes
  endTime?: string;
  reason: string;
  symptoms?: string;
  notes?: string;
  firstVisit: boolean;
  insuranceInfo?: InsuranceInfo;
  emergencyContact?: EmergencyContact;
  fee: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  cancellationPolicy?: CancellationPolicy;
  remindersSent?: AppointmentReminder[];
  checkInTime?: string;
  checkOutTime?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberName?: string;
  relationshipToSubscriber?: string;
}

export interface CancellationPolicy {
  allowed: boolean;
  deadline: string;
  fee: number;
  feePercentage?: number;
}

export interface AppointmentReminder {
  type: '24h' | '1h' | '30min' | 'custom';
  sentAt: string;
  channel: 'push' | 'email' | 'sms' | 'whatsapp';
  status: 'sent' | 'delivered' | 'failed';
}

// ============================================================================
// QUEUE MODELS
// ============================================================================

export type QueueStatus = 'waiting' | 'notified' | 'on-way' | 'arrived' | 'completed' | 'cancelled';
export type TravelMode = 'driving' | 'walking' | 'transit' | 'bicycling' | 'custom';

export interface QueueEntry {
  id: string;
  position: number;
  totalInQueue: number;
  estimatedWaitTime: number; // minutes
  estimatedCallTime: string;
  status: QueueStatus;
  professionalId: string;
  professional: Partial<Professional>;
  clinicId: string;
  clinic: Partial<Clinic>;
  patientId: string;
  patient?: Partial<User>;
  reason: string;
  symptoms?: string;
  priority?: 'normal' | 'urgent';
  travelInfo: TravelInfo;
  userLocation?: Coordinates;
  updates?: QueueUpdate[];
  notificationsSent?: QueueNotification[];
  joinedAt: string;
  notifiedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TravelInfo {
  mode: TravelMode;
  duration: number; // minutes
  distance?: number; // km
  leaveTime: string;
}

export interface QueueUpdate {
  timestamp: string;
  event: 'position_changed' | 'wait_time_updated' | 'notified' | 'status_changed' | 'professional_changed';
  oldPosition?: number;
  newPosition?: number;
  oldWaitTime?: number;
  newWaitTime?: number;
  oldStatus?: QueueStatus;
  newStatus?: QueueStatus;
  message?: string;
}

export interface QueueNotification {
  type: 'position_update' | 'time_to_leave' | 'almost_ready' | 'next_in_line' | 'called';
  sentAt: string;
  channel: 'push' | 'sms' | 'email';
  acknowledged?: boolean;
}

// ============================================================================
// PAYMENT MODELS
// ============================================================================

export type PaymentMethod = 'card' | 'cash' | 'insurance' | 'digital_wallet';

export interface Payment {
  id: string;
  appointmentId?: string;
  queueEntryId?: string;
  patientId: string;
  clinicId: string;
  professionalId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  provider: 'stripe' | 'mercadopago' | 'cash';
  transactionId?: string;
  paymentIntentId?: string;
  metadata?: PaymentMetadata;
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMetadata {
  cardBrand?: string;
  cardLast4?: string;
  receiptUrl?: string;
  invoiceUrl?: string;
  description?: string;
}

// ============================================================================
// NOTIFICATION MODELS
// ============================================================================

export type NotificationType = 
  | 'appointment_reminder'
  | 'appointment_confirmed'
  | 'appointment_cancelled'
  | 'appointment_rescheduled'
  | 'queue_update'
  | 'queue_notification'
  | 'payment_received'
  | 'payment_failed'
  | 'review_request'
  | 'system_announcement';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  read: boolean;
  readAt?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channel: 'push' | 'email' | 'sms' | 'in-app';
  scheduledFor?: string;
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface NotificationData {
  appointmentId?: string;
  queueId?: string;
  clinicId?: string;
  professionalId?: string;
  deepLink?: string;
  actionUrl?: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// REVIEW MODELS
// ============================================================================

export interface Review {
  id: string;
  appointmentId: string;
  professionalId: string;
  clinicId: string;
  patientId: string;
  patient: {
    name: string;
    avatar?: string;
  };
  rating: number; // 1-5
  comment: string;
  categories?: ReviewCategories;
  helpful?: number;
  reported?: boolean;
  response?: ReviewResponse;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCategories {
  professionalism?: number;
  communication?: number;
  waitTime?: number;
  cleanliness?: number;
  facilities?: number;
}

export interface ReviewResponse {
  text: string;
  respondedBy: string;
  respondedAt: string;
}

// ============================================================================
// ANALYTICS MODELS
// ============================================================================

export interface AnalyticsSummary {
  period: {
    start: string;
    end: string;
  };
  appointments: AppointmentAnalytics;
  queue: QueueAnalytics;
  revenue: RevenueAnalytics;
  patients: PatientAnalytics;
  professionals: ProfessionalAnalytics;
}

export interface AppointmentAnalytics {
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  cancelRate: number;
  noShowRate: number;
  completionRate: number;
  averageDuration: number;
  bySpecialty: Record<string, number>;
  byDay: Record<string, number>;
  byHour: Record<string, number>;
}

export interface QueueAnalytics {
  totalEntries: number;
  averageWaitTime: number;
  averageQueueLength: number;
  peakTimes: Array<{
    hour: number;
    count: number;
  }>;
  abandonmentRate: number;
}

export interface RevenueAnalytics {
  total: number;
  byPaymentMethod: Record<PaymentMethod, number>;
  bySpecialty: Record<string, number>;
  averageTransactionValue: number;
  refunds: number;
}

export interface PatientAnalytics {
  total: number;
  new: number;
  returning: number;
  retentionRate: number;
  averageVisitsPerPatient: number;
}

export interface ProfessionalAnalytics {
  totalActive: number;
  averageRating: number;
  averageAppointmentsPerDay: number;
  topPerformers: Array<{
    id: string;
    name: string;
    rating: number;
    appointments: number;
  }>;
}

// ============================================================================
// AVAILABILITY MODELS
// ============================================================================

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  available: boolean;
  booked?: boolean;
  blocked?: boolean;
  reason?: string;
}

export interface DayAvailability {
  date: string;
  slots: AvailabilitySlot[];
  isFullyBooked: boolean;
  totalSlots: number;
  availableSlots: number;
}

// ============================================================================
// SEARCH & FILTER MODELS
// ============================================================================

export interface SearchFilters {
  query?: string;
  location?: Coordinates;
  radius?: number; // km
  specialty?: string;
  subSpecialty?: string;
  rating?: number;
  availableToday?: boolean;
  acceptsInsurance?: boolean;
  hasVirtualQueue?: boolean;
  languages?: string[];
  gender?: Gender;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface SortOptions {
  field: 'distance' | 'rating' | 'price' | 'availability' | 'name';
  order: 'asc' | 'desc';
}

// ============================================================================
// PAGINATION MODELS
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// API RESPONSE MODELS
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// ============================================================================
// FORM MODELS
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword?: string;
  role?: UserRole;
  tenantId?: string;
}

export interface AppointmentBookingData {
  professionalId: string;
  clinicId: string;
  dateTime: string;
  duration: number;
  reason: string;
  symptoms?: string;
  firstVisit: boolean;
  insuranceInfo?: InsuranceInfo;
  emergencyContact?: EmergencyContact;
  notes?: string;
}

export interface QueueJoinData {
  professionalId: string;
  clinicId: string;
  reason: string;
  symptoms?: string;
  travelMode: TravelMode;
  travelTime: number;
  userLocation: Coordinates;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================================================
// EXPORT ALL
// ============================================================================
