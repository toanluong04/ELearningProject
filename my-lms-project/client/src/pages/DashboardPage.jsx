import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import CourseCard from '../components/CourseCard';

function DashboardPage() {
  const [courses, setCourses] = useState([]);
  const [searchParams] = useSearchParams();
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    // 1. Catch the success/cancel message from Stripe
    if (searchParams.get('enrollment') === 'success') {
      setAlertMsg('Payment successful! You are now enrolled in the course.');
      // Clean up the URL so the message doesn't stick around on refresh
      window.history.replaceState(null, '', '/dashboard');
    } else if (searchParams.get('enrollment') === 'cancelled') {
      setAlertMsg('Checkout was cancelled.');
      window.history.replaceState(null, '', '/dashboard');
    }

    // 2. Fetch the enrolled courses
    const fetchCourses = async () => {
      try {
        const courseRes = await api.get('/courses/my-courses/all');
        setCourses(courseRes.data);
      } catch (err) { 
        console.error("Error fetching courses", err); 
      }
    };
    fetchCourses();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-8">My Dashboard</h1>

      {/* Stripe Alert Banner */}
      {alertMsg && (
        <div className={`p-4 rounded-xl mb-8 font-bold border ${alertMsg.includes('cancelled') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
          {alertMsg}
        </div>
      )}

      {/* Enrolled Courses Section */}
      <h2 className="text-2xl font-bold mb-6">My Enrolled Courses</h2>
      
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map(course => (
            <CourseCard key={course._id} course={course} isEnrolled={true} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white border border-dashed border-gray-300 rounded-xl">
          <p className="text-gray-500 mb-4 font-medium">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;