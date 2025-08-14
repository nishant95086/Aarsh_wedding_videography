const express = require('express');
const Media = require('../models/Media');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer temp storage
const storage = multer.diskStorage({});
const upload = multer({ storage });

// @desc    Get all media (public)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    let query = { isActive: true };

    if (type) {
      query.type = type;
    }

    const media = await Media.find(query)
      .populate('uploadedBy', 'name')
      .sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: media.length,
      data: media
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @desc    Upload single photo to Cloudinary
// @route   POST /api/media/photo
// @access  Private (Admin only)
router.post(
  '/photo',
  protect,
  authorize('admin', 'super_admin'),
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Image file is required' });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'wedding-portfolio/photos'
      });

      const { title, description } = req.body;

      const media = await Media.create({
        type: 'photo',
        title: title || '',
        description: description || '',
        imageUrl: result.secure_url, // ✅ FIXED: correct field
        uploadedBy: req.user.id
      });

      const populatedMedia = await Media.findById(media._id)
        .populate('uploadedBy', 'name');

      res.status(201).json({
        success: true,
        message: 'Photo uploaded successfully',
        data: populatedMedia
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
);

// @desc    Add video (URL only)
router.post('/video', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ success: false, message: 'Video URL is required' });
    }

    const media = await Media.create({
      type: 'video',
      title: title || '',
      description: description || '',
      videoUrl,
      uploadedBy: req.user.id
    });

    const populatedMedia = await Media.findById(media._id)
      .populate('uploadedBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Video added successfully',
      data: populatedMedia
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @desc    Update media
router.put('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { title, description, order, isActive, imageUrl, videoUrl } = req.body;

    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    if (title !== undefined) media.title = title;
    if (description !== undefined) media.description = description;
    if (order !== undefined) media.order = order;
    if (isActive !== undefined) media.isActive = isActive;
    if (imageUrl !== undefined) media.imageUrl = imageUrl; // ✅ FIXED for photo update
    if (videoUrl !== undefined) media.videoUrl = videoUrl;

    await media.save();

    const updatedMedia = await Media.findById(media._id)
      .populate('uploadedBy', 'name');

    res.json({ success: true, message: 'Media updated successfully', data: updatedMedia });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @desc    Delete media
router.delete('/:id', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    await Media.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @desc    Get media by ID
router.get('/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate('uploadedBy', 'name');

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' });
    }

    res.json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
