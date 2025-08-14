const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['photo', 'video'],
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // For photos: Cloudinary image URL
  imageUrl: {
    type: String,
    required: function() { return this.type === 'photo'; }
  },
  // For videos: YouTube URL
  videoUrl: {
    type: String,
    required: function() { return this.type === 'video'; }
  },
  // For videos: YouTube thumbnail
  thumbnailUrl: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate YouTube thumbnail URL for videos
mediaSchema.pre('save', function(next) {
  if (this.type === 'video' && this.videoUrl && !this.thumbnailUrl) {
    const videoId = this.extractYouTubeId(this.videoUrl);
    if (videoId) {
      this.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }
  next();
});

// Method to extract YouTube ID
mediaSchema.methods.extractYouTubeId = function(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

module.exports = mongoose.model('Media', mediaSchema);
