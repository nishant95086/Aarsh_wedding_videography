const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ role: 'super_admin' });
    
    if (existingSuperAdmin) {
      console.log('❌ Super admin already exists');
      process.exit(0);
    }

    // Create super admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: process.env.SUPER_ADMIN_EMAIL || 'admin@aarshwedding.com',
      password: process.env.SUPER_ADMIN_PASSWORD || 'admin123',
      role: 'super_admin',
      isApproved: true,
      approvedAt: Date.now()
    });

    console.log('✅ Super admin created successfully');
    console.log('📧 Email:', superAdmin.email);
    console.log('🔑 Password:', process.env.SUPER_ADMIN_PASSWORD || 'admin123');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    process.exit(1);
  }
};

createSuperAdmin(); 