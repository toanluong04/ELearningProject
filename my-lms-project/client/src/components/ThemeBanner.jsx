// src/components/ThemeBanner.jsx
import React from 'react';

function ThemeBanner() {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Education GrowCourse Theme</h2>
        <p className="text-lg mb-8">
          The all-in-one solution for your online education website.
        </p>
        <a 
          href="#" 
          className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium text-lg hover:bg-gray-100"
        >
          Purchase Now
        </a>
      </div>
    </section>
  );
}

export default ThemeBanner;