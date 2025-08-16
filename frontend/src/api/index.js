// =============================
// Main API Index File
// =============================

// Import API modules
import { authAPI } from './auth.js';
import { mediaAPI } from './media.js';

// Import utility functions
import { apiRequest, uploadFile, validateResponse } from './utils.js';

// Import config constants
import { API_CONFIG, getHeaders, ERROR_MESSAGES } from './config.js';

// =============================
// Named Exports (recommended)
// =============================

export {
  authAPI,
  mediaAPI,
  apiRequest,
  uploadFile,
  validateResponse,
  API_CONFIG,
  getHeaders,
  ERROR_MESSAGES,
};

// =============================
// Default Export (Convenience)
// =============================

/**
 * Centralized API object for convenience imports.
 * Example:
 *   import API from './api';
 *   API.auth.login(...);
 *   API.media.getAll();
 */
export default {
  auth: authAPI,
  media: mediaAPI,

  utils: {
    apiRequest,
    uploadFile,
    validateResponse,
  },

  config: {
    API_CONFIG,
    getHeaders,
  },

  errors: ERROR_MESSAGES,
};
