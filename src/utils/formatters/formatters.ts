// src/utils/formatters.ts
/**
 * Formatting Utilities
 * Common functions for formatting dates, currency, phone numbers, etc.
 */

import { format, formatDistance, formatRelative, parseISO, isValid } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @param formatString - Format pattern (default: 'MMM dd, yyyy')
 * @param locale - Locale for formatting (default: 'en')
 */
export const formatDate = (
  date: string | Date,
  formatString: string = 'MMM dd, yyyy',
  locale: 'en' | 'es' = 'en'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }

    const localeObj = locale === 'es' ? es : enUS;
    return format(dateObj, formatString, { locale: localeObj });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Format date and time
 * @param date - Date string or Date object
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'MMM dd, yyyy - h:mm a');
};

/**
 * Format time only
 * @param date - Date string or Date object
 */
export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'h:mm a');
};

/**
 * Format date to short format (MM/DD/YYYY)
 */
export const formatDateShort = (date: string | Date): string => {
  return formatDate(date, 'MM/dd/yyyy');
};

/**
 * Format date to long format (Month Day, Year)
 */
export const formatDateLong = (date: string | Date): string => {
  return formatDate(date, 'MMMM dd, yyyy');
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export const formatRelativeTime = (
  date: string | Date,
  baseDate?: Date,
  locale: 'en' | 'es' = 'en'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }

    const localeObj = locale === 'es' ? es : enUS;
    return formatDistance(dateObj, baseDate || new Date(), {
      addSuffix: true,
      locale: localeObj,
    });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid date';
  }
};

/**
 * Format relative date (e.g., "Today at 5:30 PM", "Yesterday at 10:00 AM")
 */
export const formatRelativeDate = (
  date: string | Date,
  locale: 'en' | 'es' = 'en'
): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }

    const localeObj = locale === 'es' ? es : enUS;
    return formatRelative(dateObj, new Date(), { locale: localeObj });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid date';
  }
};

/**
 * Format appointment date for display
 */
export const formatAppointmentDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateStr = formatDateShort(dateObj);
  const todayStr = formatDateShort(today);
  const tomorrowStr = formatDateShort(tomorrow);

  if (dateStr === todayStr) {
    return `Today at ${formatTime(dateObj)}`;
  } else if (dateStr === tomorrowStr) {
    return `Tomorrow at ${formatTime(dateObj)}`;
  } else {
    return formatDateTime(dateObj);
  }
};

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Format number as currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `$${amount.toFixed(2)}`;
  }
};

/**
 * Format currency with compact notation (e.g., $1.2K, $3.5M)
 */
export const formatCurrencyCompact = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(amount);
  } catch (error) {
    console.error('Error formatting compact currency:', error);
    return formatCurrency(amount, currency, locale);
  }
};

// ============================================================================
// NUMBER FORMATTING
// ============================================================================

/**
 * Format number with thousands separator
 */
export const formatNumber = (
  num: number,
  decimals: number = 0,
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return num.toString();
  }
};

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 0,
  locale: string = 'en-US'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${value.toFixed(decimals)}%`;
  }
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// ============================================================================
// PHONE NUMBER FORMATTING
// ============================================================================

/**
 * Format phone number
 * @param phone - Phone number string
 * @param countryCode - Country code (default: 'US')
 */
export const formatPhoneNumber = (
  phone: string,
  countryCode: string = 'US'
): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Format based on country code
  switch (countryCode) {
    case 'US':
      // Format: (123) 456-7890
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      } else if (cleaned.length === 11 && cleaned[0] === '1') {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
      }
      break;

    case 'AR':
      // Format: +54 9 11 1234-5678
      if (cleaned.length >= 10) {
        return `+54 ${cleaned}`;
      }
      break;

    default:
      return phone;
  }

  return phone;
};

/**
 * Mask phone number (show only last 4 digits)
 */
export const maskPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;
  return `***-***-${cleaned.slice(-4)}`;
};

// ============================================================================
// NAME FORMATTING
// ============================================================================

/**
 * Format full name
 */
export const formatFullName = (
  firstName: string,
  lastName: string,
  middleName?: string
): string => {
  if (middleName) {
    return `${firstName} ${middleName} ${lastName}`;
  }
  return `${firstName} ${lastName}`;
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format name for display (First Last)
 */
export const formatNameDisplay = (name: string): string => {
  return name
    .trim()
    .split(/\s+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

// ============================================================================
// ADDRESS FORMATTING
// ============================================================================

/**
 * Format full address
 */
export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}): string => {
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zip,
    address.country,
  ].filter(Boolean);

  return parts.join(', ');
};

/**
 * Format short address (City, State)
 */
export const formatAddressShort = (address: {
  city?: string;
  state?: string;
}): string => {
  const parts = [address.city, address.state].filter(Boolean);
  return parts.join(', ');
};

// ============================================================================
// DURATION FORMATTING
// ============================================================================

/**
 * Format duration in minutes to readable string
 * @param minutes - Duration in minutes
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }

  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Format wait time
 */
export const formatWaitTime = (minutes: number): string => {
  if (minutes < 1) {
    return 'Less than 1 minute';
  }
  if (minutes === 1) {
    return '1 minute';
  }
  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }

  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} ${
    remainingMinutes === 1 ? 'minute' : 'minutes'
  }`;
};

// ============================================================================
// DISTANCE FORMATTING
// ============================================================================

/**
 * Format distance in kilometers
 */
export const formatDistanceKm = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

/**
 * Format distance in miles (for US)
 */
export const formatDistanceMiles = (miles: number): string => {
  if (miles < 0.1) {
    return `${Math.round(miles * 5280)} ft`;
  }
  return `${miles.toFixed(1)} mi`;
};

// ============================================================================
// TEXT FORMATTING
// ============================================================================

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convert to title case
 */
export const toTitleCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// ============================================================================
// CREDIT CARD FORMATTING
// ============================================================================

/**
 * Format credit card number
 */
export const formatCreditCard = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cardNumber;
};

/**
 * Mask credit card number
 */
export const maskCreditCard = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return cardNumber;
  return `**** **** **** ${cleaned.slice(-4)}`;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Date
  formatDate,
  formatDateTime,
  formatTime,
  formatDateShort,
  formatDateLong,
  formatRelativeTime,
  formatRelativeDate,
  formatAppointmentDate,

  // Currency
  formatCurrency,
  formatCurrencyCompact,

  // Number
  formatNumber,
  formatPercentage,
  formatFileSize,

  // Phone
  formatPhoneNumber,
  maskPhoneNumber,

  // Name
  formatFullName,
  getInitials,
  formatNameDisplay,

  // Address
  formatAddress,
  formatAddressShort,

  // Duration
  formatDuration,
  formatWaitTime,

  // Distance
  formatDistance,
  formatDistanceMiles,

  // Text
  truncateText,
  capitalizeFirst,
  toTitleCase,

  // Credit Card
  formatCreditCard,
  maskCreditCard,
};
