// Main API index file - exports all API modules and utilities

// Import API modules
import { authAPI } from './auth.js';
import { mediaAPI } from './media.js';

// Import utility functions
import { apiRequest, uploadFile, validateResponse } from './utils.js';

// Import config constants
import { API_CONFIG, getHeaders, ERROR_MESSAGES } from './config.js';

// Named exports (recommended for tree-shaking & clarity)
export {
  authAPI,
  mediaAPI,
  apiRequest,
  uploadFile,
  validateResponse,
  API_CONFIG,
  getHeaders,
  ERROR_MESSAGES
};

// Default export with all APIs grouped
export default {
  auth: authAPI,
  media: mediaAPI,
  utils: {
    apiRequest,
    uploadFile,
    validateResponse
  },
  config: {
    API_CONFIG,
    getHeaders,
    ERROR_MESSAGES
  }
};
