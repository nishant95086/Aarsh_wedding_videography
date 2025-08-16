// =====================
// API Configuration
// =====================
const normalizeBaseUrl = (url) => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const API_CONFIG = {
  BASE_URL: normalizeBaseUrl(import.meta.env.VITE_BACKEND || 'http://localhost:5000/api'), // auto remove trailing slash
  TIMEOUT: 10000,     // request timeout (ms)
  RETRY_ATTEMPTS: 3,  // number of retry attempts on failure
};

// =====================
// Headers Utility
// =====================
export const getHeaders = (token = null, isFormData = false, extraHeaders = {}) => {
  const headers = {
    Accept: 'application/json',
    ...extraHeaders,
  };

  // Only set Content-Type if not FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// =====================
// Error Messages
// =====================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  FORBIDDEN: "Access denied. You don't have permission.",
  NOT_FOUND: 'Resource not found.',
  BAD_REQUEST: 'Invalid request. Please check your input.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};
