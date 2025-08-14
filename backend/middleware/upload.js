// middleware/uploadMiddleware.js

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'wedding_portfolio', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
  },
});

// Create multer instance
const upload = multer({ storage });

// Export middleware to handle single image upload
exports.uploadSingleImage = upload.single('image');

// If you still want URL validation (optional for client-provided URLs)
exports.validateImageUrl = (req, res, next) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({
      success: false,
      message: 'Image URL is required'
    });
  }

  const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
  if (!urlPattern.test(imageUrl)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid image URL format'
    });
  }

  next();
};
