// server/controllers/courseController.js
const Course = require('../models/course'); 
const Enrollment = require('../models/enrollment');
const Review = require('../models/review');
const User = require('../models/user'); 

// --- Public/Student Course Endpoints ---
exports.getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching courses' });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching course details' });
  }
};

// --- Admin Course Endpoints ---
exports.createCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating course' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating course' });
  }
};

// --- Upload Endpoints ---
exports.uploadVideo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No video file uploaded' });
  }
  
  // 1. Grab the raw URL directly from Cloudinary (NOT localhost!)
  let finalUrl = req.file.path;
  
  // 2. THE CLOUDINARY FAIL-SAFE: Force the link to end in .mp4
  if (finalUrl.includes('cloudinary.com') && !finalUrl.endsWith('.mp4')) {
      finalUrl = finalUrl.replace(/\.[^/.]+$/, ".mp4"); 
  }

  res.json({ videoUrl: finalUrl });
};

// RESTORED: This was missing in your file!
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }
  res.json({ imageUrl: req.file.path });
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting course' });
  }
};

// --- Enrollment & Content ---
exports.enroll = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    if (course.price > 0 && (user.balance || 0) < course.price) {
      return res.status(400).json({ message: 'Insufficient funds. Please add cash to your wallet.' });
    }

    const newEnrollment = new Enrollment({ user: userId, course: courseId });
    await newEnrollment.save();
    
    if (course.price > 0) {
      user.balance -= course.price;
      await user.save();
    }

    await Course.findByIdAndUpdate(courseId, { $inc: { studentCount: 1 } });

    res.status(201).json({ message: 'Enrolled successfully! Funds deducted.' });
  } catch (err) { 
    console.error("Enrollment Error:", err);
    res.status(500).json({ message: 'A server error occurred during enrollment.' }); 
  }
};

exports.getEnrollmentStatus = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ user: req.user.id, course: req.params.courseId });
    res.json({ isEnrolled: !!enrollment });
  } catch (err) {
    res.status(500).json({ message: 'Server error checking status' });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id });
    const courses = await Course.find({ _id: { $in: enrollments.map(e => e.course) } });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching user courses' });
  }
};

exports.getCourseContent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = await Enrollment.findOne({ user: req.user.id, course: req.params.id });
    if (!enrollment && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You must be enrolled to view this content.' });
    }
    res.json(course);
  } catch (err) { 
    res.status(500).json({ message: 'Server error fetching content' }); 
  }
};