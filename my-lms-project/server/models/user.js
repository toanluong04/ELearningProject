// server/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  balance: { type: Number, default: 0 },
  

  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] 
});

module.exports = mongoose.model('User', userSchema);