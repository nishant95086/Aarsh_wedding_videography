// API Configuration
export const API_CONFIG = {
  // import.meta.env.VITE_API_BASE_URL || 
  BASE_URL: ('http://localhost:5000/api').replace(/\/$/, ''), // remove trailing slash
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Common headers
export const getHeaders = (token = null, isFormData = false) => {
  const headers = {};

  // Only set Content-Type if NOT FormData (browser sets correct boundaries automatically)
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  FORBIDDEN: 'Access denied. You don\'t have permission.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};
