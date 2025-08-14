import { API_CONFIG, getHeaders, ERROR_MESSAGES } from './config.js';

/**
 * Generic API request function with retry logic
 */
export const apiRequest = async (endpoint, options = {}) => {
  const { retryAttempts = API_CONFIG.RETRY_ATTEMPTS } = options;

  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        headers: getHeaders(options.token),
        ...options,
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        const errorData = await response.json().catch(() => ({}));

        switch (response.status) {
          case 401:
            errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
            break;
          case 403:
            errorMessage = ERROR_MESSAGES.FORBIDDEN;
            break;
          case 404:
            errorMessage = ERROR_MESSAGES.NOT_FOUND;
            break;
          case 422:
            errorMessage = errorData.message || ERROR_MESSAGES.VALIDATION_ERROR;
            break;
          case 500:
            errorMessage = ERROR_MESSAGES.SERVER_ERROR;
            break;
          default:
            errorMessage = errorData.message || errorMessage;
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (attempt === retryAttempts) {
        console.error('API request failed after all retries:', error);
        throw error;
      }

      // Exponential backoff before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
};

/**
 * Handle file uploads (with optional progress tracking)
 * For Cloudinary photo uploads: field name MUST match backend multer config
 */
export const uploadFile = async (
  endpoint,
  file,
  token,
  additionalFields = {},
  onProgress = null
) => {
  const formData = new FormData();
  
  // This must match backend multer field name (usually 'file')
  formData.append('image', file);

  // Append any extra fields like title, description, etc.
  Object.entries(additionalFields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    // Progress tracking
    xhr.upload.addEventListener('progress', (event) => {
      if (onProgress && event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    });

    // Success
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch {
          reject(new Error('Invalid JSON response'));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    // Error
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('POST', `${API_CONFIG.BASE_URL}${endpoint}`);
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    xhr.send(formData);
  });
};

/**
 * Validate API response
 */
export const validateResponse = (response, requiredFields = []) => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid response format');
  }

  for (const field of requiredFields) {
    if (!(field in response)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return response;
};
