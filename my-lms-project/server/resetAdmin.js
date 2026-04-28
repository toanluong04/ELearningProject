// server/resetAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Define User Schema (So we can talk to the DB)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' }
});
const User = mongoose.model('User', userSchema);

const resetPassword = async () => {
  try {
    // 2. Connect to Database
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    // 3. Define the New Password
    const NEW_PASSWORD = 'admin123'; 
    const ADMIN_EMAIL = 'admin@growcourse.com';

    // 4. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

    // 5. Update the user
    const updatedUser = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      { password: hashedPassword },
      { new: true } // Return the updated document
    );

    if (updatedUser) {
      console.log(`🎉 SUCCESS! Password for ${ADMIN_EMAIL} has been reset to: ${NEW_PASSWORD}`);
    } else {
      console.log(`❌ Error: Could not find user with email ${ADMIN_EMAIL}`);
      console.log('Did you delete the admin account? If so, run "node server/seedAdmin.js" instead.');
    }

  } catch (err) {
    console.error('❌ Database Error:', err);
  } finally {
    mongoose.connection.close();
  }
};

resetPassword();