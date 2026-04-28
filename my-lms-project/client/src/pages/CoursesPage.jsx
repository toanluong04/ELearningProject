// src/pages/CoursesPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import CourseCard from '../components/CourseCard';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for Search and Sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('popular');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        // We can reuse your featured endpoint since it currently fetches all courses!
        const response = await api.get('/courses/featured');
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // --- FILTER & SORT LOGIC ---
  const filteredAndSortedCourses = courses
    // 1. Filter by search term (checks title and category)
    .filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // 2. Sort the remaining courses
    .sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'popular') return (b.studentCount || 0) - (a.studentCount || 0);
      return 0;
    });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-6">
        
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Explore All Courses</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our complete catalog of high-quality courses. Use the tools below to find exactly what you are looking for to advance your career.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
          
          {/* Search Bar */}
          <div className="w-full md:w-1/2 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search by course name or category..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="w-full md:w-auto flex items-center gap-3">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Sort By:</label>
            <select 
              className="w-full md:w-48 p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-200 outline-none font-medium text-gray-700 cursor-pointer"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredAndSortedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedCourses.map(course => (
              <CourseCard key={course._id} course={course} isEnrolled={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search terms to find what you're looking for.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default CoursesPage;