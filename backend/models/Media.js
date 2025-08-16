const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['photo', 'video'],
    required: true,
  },
  title: { type: String, trim: true },
  description: { type: String, trim: true },

  // For photos (Cloudinary)
  publicId: {
    type: String,
    required: function () {
      return this.type === 'photo';
    },
  },
  imageUrl: {
    type: String, // can keep Cloudinary secure_url as fallback
  },
  width: Number,        // original width
  height: Number,       // original height
  aspectRatio: Number,  // width / height
  placeholderUrl: String, // tiny blurred placeholder
  dominantColor: String,  // optional: dominant color from Cloudinary

  // For videos
  videoUrl: {
    type: String,
    required: function () {
      return this.type === 'video';
    },
  },
  thumbnailUrl: { type: String },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

/**
 * Pre-save hook for YouTube thumbnails
 */
mediaSchema.pre('save', function (next) {
  if (this.type === 'video' && this.videoUrl && !this.thumbnailUrl) {
    const videoId = this.extractYouTubeId(this.videoUrl);
    if (videoId) {
      this.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }
  // Auto-calc aspect ratio for photos
  if (this.type === 'photo' && this.width && this.height) {
    this.aspectRatio = this.width / this.height;
  }
  next();
});

/**
 * Method to extract YouTube video ID
 */
mediaSchema.methods.extractYouTubeId = function (url) {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

module.exports = mongoose.model('Media', mediaSchema);
