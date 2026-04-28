// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from 'react'; // <-- Added useRef
import axios from 'axios';
// NO Header or Footer imports here
import CourseCard from '../components/CourseCard';
import Hero from '../components/Hero';
import TopCategories from '../components/TopCategories';
import AddonBanner from '../components/AddonBanner';
import Integrations from '../components/Integrations';
import ThemeBanner from '../components/ThemeBanner';
import DownloadBanner from '../components/DownloadBanner';
import LatestArticles from '../components/LatestArticles';

// --- NEW: SVG Icons for the arrows ---
const IconLeft = () => <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>;
const IconRight = () => <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>;

function HomePage() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // NEW: Reference to the scrollable container
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/courses/featured');
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // NEW: Function to handle clicking the arrows
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350; 
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Hero />
      <TopCategories />
      <AddonBanner />
      <Integrations />
      <ThemeBanner />
      
      {/* UPGRADED: "Featured Courses" Section Carousel */}
      <section className="py-16 overflow-hidden">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Courses
          </h2>
          
          {isLoading ? (
            <p className="text-center">Loading courses...</p>
          ) : (
            <div className="relative group">
              
              {/* Left Arrow Button */}
              <button 
                onClick={() => scroll('left')}
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 hover:scale-110 transition-all hidden md:block"
                aria-label="Scroll left"
              >
                <IconLeft />
              </button>

              {/* Scrollable Container (Replaced Grid with Flex) */}
              <div 
                ref={scrollRef} 
                className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 px-4 -mx-4 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {courses.map(course => (
                  // Shrink-0 and min-w keep the cards from squishing together
                  <div key={course._id} className="min-w-[320px] md:min-w-[350px] snap-center shrink-0">
                    <CourseCard course={course} isEnrolled={false} />
                  </div>
                ))}
              </div>

              {/* Right Arrow Button */}
              <button 
                onClick={() => scroll('right')}
                className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 hover:scale-110 transition-all hidden md:block"
                aria-label="Scroll right"
              >
                <IconRight />
              </button>

            </div>
          )}
        </div>
      </section>

      <DownloadBanner />
      <LatestArticles />
    </>
  );
}

export default HomePage;