import { apiRequest } from './utils.js';
import { API_CONFIG } from './config.js';

export const mediaAPI = {
  // Get all media (photos and videos)
  getAll: async () => {
    const response = await apiRequest('/media');
    return response.data || response;
  },

  // Get only photos
  getPhotos: async () => {
    const response = await apiRequest('/media?type=photo');
    const data = response.data || response;
    return data.filter(item => item.type === 'photo');
  },

  // Get only videos
  getVideos: async () => {
    const response = await apiRequest('/media?type=video');
    const data = response.data || response;
    return data.filter(item => item.type === 'video');
  },

  // Get media by category
  getByCategory: async (category) => {
    const response = await apiRequest(`/media?category=${category}`);
    return response.data || response;
  },

  // Upload photo (admin only) - updated for Cloudinary
  uploadPhoto: async (file, token, title = '', description = '', onProgress = null) => {
    const formData = new FormData();
    formData.append('image', file); // must match backend's multer field name
    formData.append('title', title);
    formData.append('description', description);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (onProgress && event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${API_CONFIG.BASE_URL}/media/photo`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  },

  // Add video (admin only)
  addVideo: async (videoData, token) => {
    const response = await apiRequest('/media/video', {
      method: 'POST',
      token: token,
      body: JSON.stringify(videoData),
    });
    return response.data || response;
  },

  // Update media (admin only)
  updateMedia: async (id, updateData, token) => {
    const response = await apiRequest(`/media/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updateData),
    });
    return response.data || response;
  },

  // Delete media (admin only)
  deleteMedia: async (id, token) => {
    const response = await apiRequest(`/media/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || response;
  },

  // Bulk delete media (admin only)
  bulkDelete: async (ids, token) => {
    const response = await apiRequest('/media/bulk-delete', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ids }),
    });
    return response.data || response;
  },

  // Get media statistics (admin only)
  getStats: async (token) => {
    const response = await apiRequest('/media/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || response;
  },

  // Reorder media (admin only)
  reorderMedia: async (orderData, token) => {
    const response = await apiRequest('/media/reorder', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(orderData),
    });
    return response.data || response;
  },
};
