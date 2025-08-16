import { apiRequest } from './utils.js';
import { API_CONFIG } from './config.js';

export const mediaAPI = {
  // 🔹 Get all media
  getAll: async () => {
    try {
      const response = await apiRequest('/media');
      return response.data || response;
    } catch (error) {
      console.error("Error fetching media:", error);
      throw error;
    }
  },

  // 🔹 Get only photos
  getPhotos: async () => {
    try {
      const response = await apiRequest('/media?type=photo');
      return response.data || response;
    } catch (error) {
      console.error("Error fetching photos:", error);
      throw error;
    }
  },

  // 🔹 Get only videos
  getVideos: async () => {
    try {
      const response = await apiRequest('/media?type=video');
      return response.data || response;
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    }
  },

  // 🔹 Get media by category
  getByCategory: async (category) => {
    try {
      const response = await apiRequest(`/media?category=${encodeURIComponent(category)}`);
      return response.data || response;
    } catch (error) {
      console.error("Error fetching category media:", error);
      throw error;
    }
  },

  // 🔹 Upload photo with progress (admin only)
  uploadPhoto: async (file, token, title = '', description = '', onProgress = null) => {
    const formData = new FormData();
    formData.append('image', file); // field name must match backend
    formData.append('title', title);
    formData.append('description', description);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch {
            reject(new Error('Invalid JSON response from server'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed due to network error'));

      xhr.open('POST', `${API_CONFIG.BASE_URL}/media/photo`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  },

  // 🔹 Add video
  addVideo: async (videoData, token) => {
    return apiRequest('/media/video', {
      method: 'POST',
      token,
      body: JSON.stringify(videoData),
    });
  },

  // 🔹 Update media
  updateMedia: async (id, updateData, token) => {
    return apiRequest(`/media/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(updateData),
    });
  },

  // 🔹 Delete single media
  deleteMedia: async (id, token) => {
    return apiRequest(`/media/${id}`, {
      method: 'DELETE',
      token,
    });
  },

  // 🔹 Bulk delete
  bulkDelete: async (ids, token) => {
    return apiRequest('/media/bulk-delete', {
      method: 'DELETE',
      token,
      body: JSON.stringify({ ids }),
    });
  },

  // 🔹 Get stats
  getStats: async (token) => {
    return apiRequest('/media/stats', {
      method: 'GET',
      token,
    });
  },

  // 🔹 Reorder media
  reorderMedia: async (orderData, token) => {
    return apiRequest('/media/reorder', {
      method: 'PUT',
      token,
      body: JSON.stringify(orderData),
    });
  },
};
