// src/pages/CourseDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import AuthContext from '../context/AuthContext.jsx';

// Icons
const IconStar = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={filled ? "text-yellow-400" : "text-gray-300"}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
);
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;

function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  // State to show loading spinner on the button while Stripe loads
  const [isProcessing, setIsProcessing] = useState(false);

  // Review Form State
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data);

        // Fetch Reviews
        const reviewsRes = await api.get(`/reviews/${id}`);
        setReviews(reviewsRes.data);

        if (user) {
          const statusRes = await api.get(`/courses/enrollment-status/${id}`);
          setIsEnrolled(statusRes.data.isEnrolled);
        }
      } catch (error) { console.error("Error fetching data:", error); } 
      finally { setIsLoading(false); }
    };
    fetchCourseData();
  }, [id, user]);

  // IMPROVED: Safely Handle Direct Stripe Enrollment
  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    
    // SAFETY CHECK: Hunt down the correct ID format
    const safeUserId = user._id || user.id || user.userId; 
    
    if (!safeUserId) {
      console.error("🚨 USER OBJECT DATA:", user);
      alert("Cannot find User ID! Please check your browser console (F12) to see where the ID is hiding.");
      return;
    }
    
    setIsProcessing(true);
    setIsError(false);
    setMessage('');
    
    try {
      // Call the backend to create a Stripe checkout session
      const response = await api.post('/payments/create-checkout-session', {
        courseId: course._id || course.id,        
        courseTitle: course.title,   
        price: Number(course.price), // Force it to be a number for Stripe  
        userId: safeUserId // Safe ID attached!
      });
      
      // Redirect the user to the secure Stripe Checkout page
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      setIsError(true);
      
      // Extract the exact error from the backend if it exists
      const serverError = error.response?.data?.error || "Failed to initiate secure checkout. Please try again.";
      setMessage(`Error: ${serverError}`);
      
      setIsProcessing(false);
    }
  };

  // Submit Review Function
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/reviews', { courseId: id, rating: newReview.rating, comment: newReview.comment });
      setReviews([res.data, ...reviews]); 
      setReviewMsg('Thank you for your feedback!');
      setNewReview({ rating: 5, comment: '' }); 
      
      const newTotal = reviews.reduce((sum, r) => sum + r.rating, 0) + res.data.rating;
      setCourse({...course, rating: (newTotal / (reviews.length + 1)).toFixed(1)});
    } catch (error) {
      setReviewMsg(error.response?.data?.message || 'Failed to submit review.');
    }
  };

  if (isLoading) return <p className="text-center p-20 font-bold text-gray-400">Loading course details...</p>;
  if (!course) return <p className="text-center p-20 font-bold text-red-500 text-xl">Course not found.</p>;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{course.category}</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">{course.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
               <div className="flex items-center gap-1"><IconStar filled={true} /> <span className="font-bold text-gray-900">{course.rating > 0 ? course.rating : "New"}</span></div>
               <span>•</span>
               <span className="font-medium">{course.studentCount?.toLocaleString() || "0"} Students Enrolled</span>
            </div>
          </div>

          <img src={course.imageUrl} alt={course.title} className="w-full h-96 object-cover rounded-[2.5rem] shadow-2xl border border-gray-100" />

          {/* Description Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900">About this Course</h2>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
              {course.description || "No description provided."}
            </p>
          </div>

          {/* REVIEWS SECTION */}
          <div className="pt-10 border-t border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-8">Student Feedback</h2>
            
            {/* Review Form (Only visible if enrolled) */}
            {isEnrolled && (
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button type="button" key={star} onClick={() => setNewReview({...newReview, rating: star})}>
                      <IconStar filled={star <= newReview.rating} />
                    </button>
                  ))}
                </div>
                <textarea 
                  className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 mb-3 resize-none h-24 text-sm" 
                  placeholder="What did you think of this course?"
                  value={newReview.comment}
                  onChange={e => setNewReview({...newReview, comment: e.target.value})}
                  required
                />
                <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-black transition">Submit Feedback</button>
                {reviewMsg && <p className="text-sm text-emerald-600 font-bold mt-3">{reviewMsg}</p>}
              </form>
            )}

            {/* Review List */}
            <div className="space-y-6">
              {reviews.length > 0 ? reviews.map(review => (
                <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{review.username}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(star => <IconStar key={star} filled={star <= review.rating} />)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              )) : (
                <p className="text-gray-500 italic">No reviews yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar (Right) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 sticky top-24">
            <div className="flex flex-col mb-8">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tuition Fee</span>
              <h3 className="text-4xl font-black text-blue-600">${course.price?.toFixed(2) || "0.00"}</h3>
            </div>
            
            {/* Dynamic Button */}
            {!user ? (
              <Link to="/login" className="block w-full text-center bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 mb-4 transition shadow-md">Log In to Enroll</Link>
            ) : isEnrolled ? (
              <Link to="/dashboard" className="block w-full text-center bg-emerald-500 text-white px-6 py-4 rounded-2xl font-black text-lg hover:bg-emerald-600 mb-4 transition shadow-md">Go to Dashboard</Link>
            ) : (
              <button 
                onClick={handleEnroll} 
                disabled={isProcessing}
                className={`block w-full text-center px-6 py-4 rounded-2xl font-black text-lg mb-4 transition shadow-md ${isProcessing ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isProcessing ? 'Redirecting...' : `Enroll Now ($${course.price})`}
              </button>
            )}
            
            {message && <div className={`p-4 rounded-2xl text-sm font-bold text-center mb-6 border ${isError ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>{message}</div>}

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 px-1">What's included:</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-600 font-bold text-sm"><IconCheck /> Full HD Video Lessons</li>
                <li className="flex items-center gap-3 text-gray-600 font-bold text-sm"><IconCheck /> Lifetime Access to Resources</li>
                <li className="flex items-center gap-3 text-gray-600 font-bold text-sm"><IconCheck /> Certificate of Completion</li>
              </ul>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default CourseDetailPage;