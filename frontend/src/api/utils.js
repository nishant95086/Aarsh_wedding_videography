import { API_CONFIG, getHeaders, ERROR_MESSAGES } from './config.js';

/**
 * Generic API request function with retry + timeout support
 */
export const apiRequest = async (endpoint, options = {}) => {
  const {
    retryAttempts = API_CONFIG.RETRY_ATTEMPTS,
    timeout = API_CONFIG.TIMEOUT,
    token = null,
    headers = {},
    ...rest
  } = options;

  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      // Timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
        ...rest,
        headers: {
          ...getHeaders(token, rest.body instanceof FormData),
          ...headers, // merge user headers
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle errors
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorData = {};

        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }

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

        throw { status: response.status, message: errorMessage, data: errorData };
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
 */
export const uploadFile = async (
  endpoint,
  file,
  token,
  {
    fieldName = 'file', // default but configurable
    additionalFields = {},
    onProgress = null,
  } = {}
) => {
  const formData = new FormData();
  formData.append(fieldName, file);

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
 * Validate API response (checks required fields exist)
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
