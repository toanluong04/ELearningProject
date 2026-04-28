// server/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User Schema inline to avoid import issues
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' }
});
const User = mongoose.model('User', userSchema);

const seedAdmin = async () => {
  await mongoose.connect(process.env.DATABASE_URL);

  // 1. Check if admin already exists
  const existingAdmin = await User.findOne({ email: 'admin@growcourse.com' });
  if (existingAdmin) {
    console.log('⚠️ Admin already exists. Skipping...');
    mongoose.connection.close();
    return;
  }

  // 2. Hash the password 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Toanluong04', salt); 

  // 3. Create the Admin
  const adminUser = new User({
    username: 'SuperAdmin',
    email: 'admin@growcourse.com',
    password: hashedPassword,
    role: 'admin' 
  });

  await adminUser.save();
  console.log('✅ Admin user created successfully!');
  mongoose.connection.close();
};

seedAdmin();