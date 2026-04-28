// server/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');
const upload = require('../middleware/upload');

// Public
router.get('/featured', courseController.getFeaturedCourses);
router.get('/:id', courseController.getCourseById);

// Admin Only
router.post('/', auth, adminOnly, courseController.createCourse);
router.put('/:id', auth, adminOnly, courseController.updateCourse);
router.delete('/:id', auth, adminOnly, courseController.deleteCourse);

// Student Actions (Requires Auth)
router.post('/enroll', auth, courseController.enroll);
router.get('/enrollment-status/:courseId', auth, courseController.getEnrollmentStatus);
router.get('/my-courses/all', auth, courseController.getMyCourses); 
router.get('/:id/content', auth, courseController.getCourseContent);

// --- THE FIX: Pointing cleanly to the controller ---
router.post('/upload-video', auth, adminOnly, upload.single('video'), courseController.uploadVideo);
router.post('/upload-image', upload.single('image'), courseController.uploadImage);

module.exports = router;