// src/components/Hero.jsx
import React from 'react';

function Hero() {
  return (
    // This gradient matches the original image's background
    <section className="bg-gradient-to-r from-yellow-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side (Text) */}
        <div className="text-left">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Build Skills With Online Course
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            We are a leading online learning platform that helps you learn new skills, achieve your goals, and advance your career.
          </p>
          <a href="#" className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-blue-700">
            Get Started
          </a>
        </div>
        
        {/* Right Side (Image) */}
        <div>
          {/* We'll use a placeholder for the girl's image */}
          <img 
            src="https://www.hostgator.com/blog/wp-content/uploads/2024/10/Best-CMS-Platforms-of-2025-1024x536.png" 
            alt="E-learning student" 
            className="rounded-lg shadow-xl"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;