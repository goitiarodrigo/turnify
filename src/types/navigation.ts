// src/types/navigation.ts
/**
 * Type definitions for React Navigation
 * Provides type-safe navigation throughout the app
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { CompositeScreenProps } from '@react-navigation/native';

// ============================================================================
// AUTH STACK
// ============================================================================

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  OptionalLogin: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

export type AuthScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

// ============================================================================
// PATIENT STACK
// ============================================================================

export type PatientTabParamList = {
  Home: undefined;
  Appointments: undefined;
  QueueTab: { queueId?: string };
  Profile: undefined;
};

export type PatientStackParamList = {
  PatientTabs: undefined;
  Search: {
    specialty?: string;
    location?: { lat: number; lng: number };
  };
  ClinicDetail: { clinicId: string };
  ProfessionalDetail: { professionalId: string };
  BookAppointment: {
    professionalId: string;
    clinicId: string;
    preselectedDate?: string;
  };
  AppointmentDetail: { appointmentId: string };
  JoinQueue: {
    professionalId: string;
    clinicId: string;
  };
  QueueTracking: { queueId: string };
  Notifications: undefined;
  EditProfile: undefined;
  PaymentMethods: undefined;
  AppointmentHistory: undefined;
  FavoriteClinics: undefined;
  FavoriteProfessionals: undefined;
  Settings: undefined;
  Help: undefined;
  WriteReview: {
    appointmentId: string;
    professionalId: string;
  };
  RescheduleAppointment: { appointmentId: string };
  CancelAppointment: { appointmentId: string };
};

export type PatientScreenProps<T extends keyof PatientStackParamList> = 
  CompositeScreenProps<
    NativeStackScreenProps<PatientStackParamList, T>,
    BottomTabScreenProps<PatientTabParamList>
  >;

export type PatientTabScreenProps<T extends keyof PatientTabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<PatientTabParamList, T>,
    NativeStackScreenProps<PatientStackParamList>
  >;

// ============================================================================
// PROFESSIONAL STACK
// ============================================================================

export type ProfessionalDrawerParamList = {
  Dashboard: undefined;
  Schedule: undefined;
  QueueManagement: undefined;
  Patients: undefined;
  Settings: undefined;
};

export type ProfessionalStackParamList = {
  ProfessionalDrawer: undefined;
  PatientDetail: { patientId: string; appointmentId?: string };
  AppointmentDetail: { appointmentId: string };
  QueueDetail: { queueId: string };
  EditSchedule: undefined;
  BlockTime: { date?: string };
  ViewSchedule: { date?: string };
  Notifications: undefined;
  ProfessionalProfile: undefined;
  WorkingHours: undefined;
  ConsultationFees: undefined;
  Statistics: { period?: 'week' | 'month' | 'year' };
};

export type ProfessionalScreenProps<T extends keyof ProfessionalStackParamList> = 
  CompositeScreenProps<
    NativeStackScreenProps<ProfessionalStackParamList, T>,
    DrawerScreenProps<ProfessionalDrawerParamList>
  >;

export type ProfessionalDrawerScreenProps<T extends keyof ProfessionalDrawerParamList> = 
  CompositeScreenProps<
    DrawerScreenProps<ProfessionalDrawerParamList, T>,
    NativeStackScreenProps<ProfessionalStackParamList>
  >;

// ============================================================================
// ADMIN STACK
// ============================================================================

export type AdminDrawerParamList = {
  Dashboard: undefined;
  Professionals: undefined;
  Specialties: undefined;
  Analytics: undefined;
  Settings: undefined;
};

export type AdminStackParamList = {
  AdminDrawer: undefined;
  AddProfessional: undefined;
  EditProfessional: { professionalId: string };
  ProfessionalDetail: { professionalId: string };
  ManageSpecialties: undefined;
  AddSpecialty: undefined;
  ClinicSettings: undefined;
  PaymentSettings: undefined;
  NotificationSettings: undefined;
  AppearanceSettings: undefined;
  Appointments: undefined;
  AppointmentDetail: { appointmentId: string };
  Patients: undefined;
  PatientDetail: { patientId: string };
  Reports: undefined;
  GenerateReport: undefined;
  Notifications: undefined;
  BackupRestore: undefined;
  AuditLog: undefined;
};

export type AdminScreenProps<T extends keyof AdminStackParamList> = 
  CompositeScreenProps<
    NativeStackScreenProps<AdminStackParamList, T>,
    DrawerScreenProps<AdminDrawerParamList>
  >;

export type AdminDrawerScreenProps<T extends keyof AdminDrawerParamList> = 
  CompositeScreenProps<
    DrawerScreenProps<AdminDrawerParamList, T>,
    NativeStackScreenProps<AdminStackParamList>
  >;

// ============================================================================
// SUPER ADMIN STACK
// ============================================================================

export type SuperAdminDrawerParamList = {
  Dashboard: undefined;
  Clinics: undefined;
  System: undefined;
  Users: undefined;
};

export type SuperAdminStackParamList = {
  SuperAdminDrawer: undefined;
  AddClinic: undefined;
  EditClinic: { clinicId: string };
  ClinicDetail: { clinicId: string };
  SystemSettings: undefined;
  FeatureFlags: undefined;
  DatabaseManagement: undefined;
  Monitoring: undefined;
  Logs: undefined;
  SecuritySettings: undefined;
  APIManagement: undefined;
  UserManagement: undefined;
  UserDetail: { userId: string };
  GlobalAnalytics: undefined;
  BillingManagement: undefined;
  SupportTickets: undefined;
  Notifications: undefined;
};

export type SuperAdminScreenProps<T extends keyof SuperAdminStackParamList> = 
  CompositeScreenProps<
    NativeStackScreenProps<SuperAdminStackParamList, T>,
    DrawerScreenProps<SuperAdminDrawerParamList>
  >;

export type SuperAdminDrawerScreenProps<T extends keyof SuperAdminDrawerParamList> = 
  CompositeScreenProps<
    DrawerScreenProps<SuperAdminDrawerParamList, T>,
    NativeStackScreenProps<SuperAdminStackParamList>
  >;

// ============================================================================
// ROOT STACK
// ============================================================================

export type RootStackParamList = {
  Auth: undefined;
  Patient: undefined;
  Professional: undefined;
  Admin: undefined;
  SuperAdmin: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

// ============================================================================
// DEEP LINKING
// ============================================================================

export type DeepLinkParams = {
  'appointment/:appointmentId': { appointmentId: string };
  'queue/:queueId': { queueId: string };
  'clinic/:clinicId': { clinicId: string };
  'professional/:professionalId': { professionalId: string };
  'reset-password/:token': { token: string };
  'notifications': undefined;
};

// ============================================================================
// MODAL NAVIGATION
// ============================================================================

export type ModalParamList = {
  ConfirmationModal: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    variant?: 'default' | 'danger';
  };
  FilterModal: {
    currentFilters: any;
    onApplyFilters: (filters: any) => void;
  };
  LocationPickerModal: {
    initialLocation?: { lat: number; lng: number };
    onSelectLocation: (location: { lat: number; lng: number }) => void;
  };
  DatePickerModal: {
    initialDate?: Date;
    minDate?: Date;
    maxDate?: Date;
    onSelectDate: (date: Date) => void;
  };
  TimePickerModal: {
    initialTime?: string;
    availableSlots: string[];
    onSelectTime: (time: string) => void;
  };
  ImageViewerModal: {
    images: string[];
    initialIndex?: number;
  };
  PaymentModal: {
    amount: number;
    appointmentId: string;
    onSuccess: () => void;
    onCancel: () => void;
  };
  RatingModal: {
    appointmentId: string;
    professionalId: string;
    onSubmit: (rating: number, comment: string) => void;
  };
};

// ============================================================================
// NAVIGATION UTILITIES
// ============================================================================

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Type-safe navigation props helper
export type ScreenProps<
  Stack extends Record<string, any>,
  Screen extends keyof Stack
> = {
  navigation: any;
  route: {
    params: Stack[Screen];
    key: string;
    name: string;
  };
};

// Type for navigation ref
export type NavigationRef = any; // Will be properly typed with NavigationContainerRef

// ============================================================================
// COMMON NAVIGATION PARAMS
// ============================================================================

export interface NavigationParams {
  // Common params that can be used across navigators
  animated?: boolean;
  replace?: boolean;
  merge?: boolean;
}

// ============================================================================
// TAB BAR BADGE
// ============================================================================

export interface TabBarBadge {
  count: number;
  color?: string;
  textColor?: string;
}

// ============================================================================
// HEADER CONFIGURATION
// ============================================================================

export interface HeaderConfig {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showCloseButton?: boolean;
  rightButtons?: Array<{
    icon: string;
    onPress: () => void;
    badge?: number;
  }>;
  transparent?: boolean;
  backgroundColor?: string;
}

// ============================================================================
// EXPORTS
// ============================================================================
