const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: String,
  videoUrl: String, 
  duration: String, 
  isFree: { type: Boolean, default: false }
});

const courseSchema = new mongoose.Schema({
  imageUrl: String,
  category: String,
  title: String,
  description: String,
  price: Number,
  rating: { type: Number, default: 0 },
  studentCount: { type: Number, default: 0 },
  lessons: [lessonSchema] 
});

module.exports = mongoose.model('Course', courseSchema);