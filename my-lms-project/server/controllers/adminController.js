// server/controllers/adminController.js
const User = require('../models/user');
const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const Chat = require('../models/chat');

exports.getChatUsers = async (req, res) => {
  const userDetails = await Chat.aggregate([
      { $match: { senderId: { $ne: 'admin' } } },
      { $group: { _id: "$senderId", senderName: { $first: "$senderName" } } }
  ]);
  res.json(userDetails);
};

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();
    
    // 1. Overall Revenue
    const revenueData = await Enrollment.aggregate([
      { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'courseDetails' } },
      { $unwind: '$courseDetails' },
      { $group: { _id: null, total: { $sum: '$courseDetails.price' } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // 2. UPGRADED: Chart Data (Chronologically Sorted!)
    const chartDataRaw = await Enrollment.aggregate([
      { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'courseDetails' } },
      { $unwind: '$courseDetails' },
      {
        $group: {
          _id: {
            // Sort by this hidden real date (2026-04-15)
            sortDate: { $dateToString: { format: "%Y-%m-%d", date: "$enrolledAt" } }, 
            // Show this pretty date on the chart (Apr 15)
            displayDate: { $dateToString: { format: "%b %d", date: "$enrolledAt" } }  
          }, 
          revenue: { $sum: '$courseDetails.price' },
          enrollments: { $sum: 1 }
        }
      },
      // Sort chronologically using the YYYY-MM-DD format
      { $sort: { "_id.sortDate": 1 } } 
    ]);

    // Format for Recharts
    const chartData = chartDataRaw.map(item => ({
      name: item._id.displayDate, // Only send the pretty date to the frontend
      Revenue: item.revenue,
      Enrollments: item.enrollments
    }));

    // Fallback data
    const finalChartData = chartData.length > 0 ? chartData : [
      { name: 'Mon', Revenue: 0, Enrollments: 0 },
      { name: 'Tue', Revenue: 0, Enrollments: 0 },
      { name: 'Wed', Revenue: 0, Enrollments: 0 },
      { name: 'Thu', Revenue: 0, Enrollments: 0 },
      { name: 'Fri', Revenue: 0, Enrollments: 0 }
    ];

    res.json({ 
      users: totalUsers, 
      courses: totalCourses, 
      enrollments: totalEnrollments, 
      revenue: totalRevenue,
      chartData: finalChartData 
    });
  } catch (err) { 
    console.error("Stats Error:", err);
    res.status(500).json({ message: 'Server Error calculating stats' }); 
  }
};

exports.getUsers = async (req, res) => {
  // STRICT FILTER: Only find users where their role is 'student'
  const users = await User.find({ role: 'student' }).select('-password');
  res.json(users);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
};