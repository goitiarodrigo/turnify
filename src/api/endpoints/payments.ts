// src/api/endpoints/payments.ts
/**
 * Payments API Endpoints
 * All payment-related API calls
 */

import apiClient, { handleApiError } from '@/api/client';
import type {
  Payment,
  PaymentMethod,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
} from '@/types/models';

// ============================================================================
// TYPES
// ============================================================================

interface CreatePaymentIntentData {
  appointmentId: string;
  amount: number;
  currency: string;
  paymentMethod?: 'card' | 'cash' | 'insurance' | 'digital_wallet';
}

interface ConfirmPaymentData {
  paymentIntentId: string;
  paymentMethodId?: string;
}

interface PaymentMethodData {
  type: 'card';
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  holderName: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

interface RefundData {
  amount?: number; // If not provided, refund full amount
  reason: string;
}

// ============================================================================
// PAYMENT ENDPOINTS
// ============================================================================

/**
 * Create payment intent
 */
export const createPaymentIntent = async (
  data: CreatePaymentIntentData
): Promise<{
  clientSecret: string;
  paymentIntentId: string;
}> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{
        clientSecret: string;
        paymentIntentId: string;
      }>
    >('/payments/create-intent', data);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to create payment intent');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Confirm payment
 */
export const confirmPayment = async (
  data: ConfirmPaymentData
): Promise<Payment> => {
  try {
    const response = await apiClient.post<ApiResponse<{ payment: Payment }>>(
      '/payments/confirm',
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to confirm payment');
    }

    return response.data.data.payment;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get payment history
 */
export const getPayments = async (
  filters?: PaginationParams
): Promise<PaginatedResponse<Payment>> => {
  try {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Payment>>
    >('/payments', {
      params: filters,
    });

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch payments');
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get single payment details
 */
export const getPayment = async (paymentId: string): Promise<Payment> => {
  try {
    const response = await apiClient.get<ApiResponse<{ payment: Payment }>>(
      `/payments/${paymentId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch payment');
    }

    return response.data.data.payment;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Request refund
 */
export const requestRefund = async (
  paymentId: string,
  data: RefundData
): Promise<Payment> => {
  try {
    const response = await apiClient.post<ApiResponse<{ payment: Payment }>>(
      `/payments/${paymentId}/refund`,
      data
    );

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to request refund');
    }

    return response.data.data.payment;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get saved payment methods
 */
export const getPaymentMethods = async (): Promise<PaymentMethodData[]> => {
  try {
    const response = await apiClient.get<
      ApiResponse<{ methods: PaymentMethodData[] }>
    >('/payments/methods');

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch payment methods');
    }

    return response.data.data.methods;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Add payment method
 */
export const addPaymentMethod = async (
  data: PaymentMethodData
): Promise<PaymentMethodData> => {
  try {
    const response = await apiClient.post<
      ApiResponse<{ method: PaymentMethodData }>
    >('/payments/methods', data);

    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to add payment method');
    }

    return response.data.data.method;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete payment method
 */
export const deletePaymentMethod = async (methodId: string): Promise<void> => {
  try {
    const response = await apiClient.delete<ApiResponse>(
      `/payments/methods/${methodId}`
    );

    if (!response.data.success) {
      throw new Error('Failed to delete payment method');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Set default payment method
 */
export const setDefaultPaymentMethod = async (
  methodId: string
): Promise<void> => {
  try {
    const response = await apiClient.patch<ApiResponse>(
      `/payments/methods/${methodId}/default`
    );

    if (!response.data.success) {
      throw new Error('Failed to set default payment method');
    }
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  createPaymentIntent,
  confirmPayment,
  getPayments,
  getPayment,
  requestRefund,
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
};

export type {
  CreatePaymentIntentData,
  ConfirmPaymentData,
  PaymentMethodData,
  RefundData,
};
