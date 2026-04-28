import React from 'react';
import { Link } from 'react-router-dom';

function CourseCard({ course, isEnrolled }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
      
      {/* Course Image */}
      <div className="relative h-48 w-full bg-blue-500 overflow-hidden">
        <img 
          src={course.imageUrl} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        {/* If enrolled, show a little badge on the image */}
        {isEnrolled && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
            PURCHASED
          </div>
        )}
      </div>
      
      {/* Course Details */}
      <div className="p-5 flex-1 flex flex-col">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
          {course.category}
        </span>
        
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        {/* Only show the price if they HAVEN'T bought it yet */}
        {!isEnrolled && (
          <p className="text-xl font-black text-blue-600 mb-2">
            ${course.price?.toFixed(2) || '0.00'}
          </p>
        )}

        {/* Ratings and Students */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-5 mt-auto pt-4 border-t border-gray-50">
          <span className="flex items-center gap-1 font-medium">
            <span className="text-yellow-400">★</span> {course.rating || '4.5'}
          </span>
          <span className="font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
            {course.studentCount || 0}
          </span>
        </div>

        {/* DYNAMIC BUTTON: Changes based on enrollment status */}
        {isEnrolled ? (
          <Link 
            to={`/learn/${course._id}`} 
            className="block w-full text-center bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-200 active:scale-95"
          >
            Watch Course
          </Link>
        ) : (
          <Link 
            to={`/course/${course._id}`} 
            className="block w-full text-center bg-blue-50 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-100 transition active:scale-95"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}

export default CourseCard;