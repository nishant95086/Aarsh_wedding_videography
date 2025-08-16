import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image, Video, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mediaAPI } from '../api';

const AdminMedia = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [uploadForm, setUploadForm] = useState({
    type: 'photo',
    title: '',
    description: '',
    videoUrl: ''
  });

  const photoFileRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const data = await mediaAPI.getAll();
      setMedia(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      setError('Failed to load media. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('adminToken');

      if (uploadForm.type === 'photo') {
        if (photoFileRef.current?.files[0]) {
          await mediaAPI.uploadPhoto(
            photoFileRef.current.files[0],
            token,
            uploadForm.title,
            uploadForm.description
          );
        } else {
          throw new Error('Please select a photo file');
        }
      } else {
        if (!uploadForm.videoUrl.trim()) {
          throw new Error('Please enter a video URL');
        }

        // Convert YouTube watch URL to embed URL
        let embedUrl = uploadForm.videoUrl;
        const ytMatch = embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (ytMatch) {
          embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
        }

        await mediaAPI.addVideo(
          {
            title: uploadForm.title,
            description: uploadForm.description,
            videoUrl: embedUrl
          },
          token
        );
      }

      resetForm();
      setSuccess(`${uploadForm.type === 'photo' ? 'Photo' : 'Video'} uploaded successfully!`);
      setTimeout(() => setSuccess(null), 3000);
      fetchMedia();
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      try {
        setDeletingId(id);
        await mediaAPI.deleteMedia(id, localStorage.getItem('adminToken'));
        fetchMedia();
      } catch (error) {
        console.error('Delete error:', error);
        setError('Failed to delete media.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const resetForm = () => {
    setShowUploadForm(false);
    setUploadForm({ type: 'photo', title: '', description: '', videoUrl: '' });
    if (photoFileRef.current) {
      photoFileRef.current.value = null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Cloudinary optimization helper
  const getOptimizedImageUrl = (url) => {
    if (!url) return url;
    // Insert transformation just after "upload/"
    return url.replace(
      '/upload/',
      '/upload/f_auto,q_auto,w_600,dpr_auto/' // auto-format, auto-quality, width 600px, device pixel ratio
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-800">Media Management</h1>
              <button
                onClick={() => setShowUploadForm(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Add Media</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Add New Media</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="photo">Photo</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                  placeholder="Enter description"
                />
              </div>

              {uploadForm.type === 'photo' ? (
                <div>
                  <label className="block text-sm font-medium mb-2">Photo File</label>
                  <input
                    type="file"
                    ref={photoFileRef}
                    accept="image/*"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">Video URL</label>
                  <input
                    type="url"
                    value={uploadForm.videoUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="YouTube URL"
                    required
                  />
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Media Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {media.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {item.type === 'photo' ? (
                  <img
                    src={getOptimizedImageUrl(item.imageUrl)} // Optimized Cloudinary URL
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <iframe
                    src={item.videoUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className={`text-red-500 hover:text-red-700 ${
                      deletingId === item._id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {media.length === 0 && (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No media yet</h3>
            <p className="text-gray-600">Start by adding some photos or videos to your portfolio.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMedia;
