const express = require('express');
const User = require('../models/User');
const { protect, authorize, superAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all admin users
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['admin', 'super_admin'] } })
      .select('-password')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Create new admin (super admin only)
// @route   POST /api/admin/users
// @access  Private (Super Admin only)
router.post('/users', protect, superAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user with immediate approval
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'admin',
      isApproved: true,
      approvedBy: req.user.id,
      approvedAt: Date.now()
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update admin user
// @route   PUT /api/admin/users/:id
// @access  Private (Super Admin only)
router.put('/users/:id', protect, superAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent updating super admin role unless it's the only one
    if (role === 'admin' && user.role === 'super_admin') {
      const superAdminCount = await User.countDocuments({ role: 'super_admin' });
      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot demote the only super admin'
        });
      }
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;

    await user.save();

    res.json({
      success: true,
      message: 'Admin user updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Delete admin user
// @route   DELETE /api/admin/users/:id
// @access  Private (Super Admin only)
router.delete('/users/:id', protect, superAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting the only super admin
    if (user.role === 'super_admin') {
      const superAdminCount = await User.countDocuments({ role: 'super_admin' });
      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the only super admin'
        });
      }
    }

    // Prevent deleting self
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Admin user deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get pending admin users
// @route   GET /api/admin/pending-users
// @access  Private (Admin only)
router.get('/pending-users', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const pendingUsers = await User.find({
      role: 'pending',
      isApproved: false
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Approve pending admin user
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Super Admin only)
router.put('/users/:id/approve', protect, superAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'User is already approved'
      });
    }

    // Change role from 'pending' to 'admin' and approve
    user.role = 'admin';
    user.isApproved = true;
    user.approvedBy = req.user.id;
    user.approvedAt = Date.now();
    await user.save();

    res.json({
      success: true,
      message: 'User approved successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Reject pending admin user
// @route   DELETE /api/admin/users/:id/reject
// @access  Private (Super Admin only)
router.delete('/users/:id/reject', protect, superAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only reject pending users'
      });
    }

    // Delete the pending user
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User rejected and deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
router.get('/stats', protect, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const Media = require('../models/Media');

    // Get counts
    const totalPhotos = await Media.countDocuments({ type: 'photo', isActive: true });
    const totalVideos = await Media.countDocuments({ type: 'video', isActive: true });

    // Get pending admin requests
    const pendingAdminRequests = await User.countDocuments({ 
      role: 'pending',
      isApproved: false 
    });

    res.json({
      success: true,
      data: {
        totalMedia: totalPhotos + totalVideos,
        pendingAdminRequests,
        media: {
          photos: totalPhotos,
          videos: totalVideos
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router; 