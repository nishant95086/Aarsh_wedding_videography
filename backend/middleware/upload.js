// middleware/uploadMiddleware.js

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'wedding_portfolio', // Cloudinary folder
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      use_filename: true,           // keep original file name
      unique_filename: true,        // prevent collisions
      overwrite: false,
      resource_type: 'image',
      // ⚠️ Do NOT apply heavy transformations at upload time.
      // Always store originals. We'll use transformations on delivery.
    };
  },
});

// Multer instance with file size limits
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // max 10MB per image
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPG, PNG, WEBP allowed.'));
    }
    cb(null, true);
  },
});

// === Middleware Exports ===

// Single image upload
exports.uploadSingleImage = upload.single('image');

// Multiple images upload (gallery batch)
exports.uploadMultipleImages = upload.array('images', 10); // max 10 files at once

// Optional: Validate URL if client provides external image link
exports.validateImageUrl = (req, res, next) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({
      success: false,
      message: 'Image URL is required',
    });
  }

  const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
  if (!urlPattern.test(imageUrl)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid image URL format',
    });
  }

  next();
};

// Multer error handler
exports.handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    return res.status(400).json({
      success: false,
      message: `Multer error: ${err.message}`,
    });
  } else if (err) {
    // Unknown errors
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};
