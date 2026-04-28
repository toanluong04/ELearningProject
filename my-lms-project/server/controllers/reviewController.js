const Review = require('../models/review');
const Enrollment = require('../models/enrollment');
const Course = require('../models/course');

exports.addReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    
    // 1. Verify Enrollment
    const enrolled = await Enrollment.findOne({ user: req.user.id, course: courseId });
    if (!enrolled && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only enrolled students can leave feedback.' });
    }

    // 2. Prevent duplicate reviews
    const existingReview = await Review.findOne({ user: req.user.id, course: courseId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this course.' });
    }

    // 3. Save Review
    const review = new Review({ 
      user: req.user.id, 
      username: req.user.username, 
      course: courseId, 
      rating, 
      comment 
    });
    await review.save();

    // 4. Calculate Real Average Rating & Update Course
    const allReviews = await Review.find({ course: courseId });
    const avgRating = allReviews.reduce((sum, item) => sum + item.rating, 0) / allReviews.length;
    
    await Course.findByIdAndUpdate(courseId, { rating: avgRating.toFixed(1) });

    res.status(201).json(review);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};