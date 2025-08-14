import { apiRequest, validateResponse } from './utils.js';

// Authentication API functions
export const authAPI = {
  // Login user
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    return response;
  },

  // Register new user
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    return response;
  },

  // Get current user profile
  getCurrentUser: async (token) => {
    const response = await apiRequest('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data || response;
  },

  // Get pending admin requests (super admin only)
  getPendingAdmins: async (token) => {
    const response = await apiRequest('/auth/pending', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data || response;
  },

  // Approve admin request (super admin only)
  approveAdmin: async (id, token) => {
    const response = await apiRequest(`/auth/approve/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data || response;
  },

  // Reject admin request (super admin only)
  rejectAdmin: async (id, token) => {
    const response = await apiRequest(`/auth/reject/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data || response;
  },

  // Change password
  changePassword: async (passwordData, token) => {
    const response = await apiRequest('/auth/change-password', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(passwordData),
    });
    
    return response.data || response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    
    return response.data || response;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
    
    return response.data || response;
  },
}; 