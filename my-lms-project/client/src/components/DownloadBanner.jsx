// src/components/DownloadBanner.jsx
import React from 'react';

function DownloadBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-50 to-orange-50">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            GrowCourse Academy
          </h2>
          <p className="text-lg text-gray-700">
            Download our guide to see how GrowCourse works.
          </p>
        </div>
        <a 
          href="#" 
          className="bg-orange-500 text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-orange-600 mt-6 md:mt-0"
        >
          Download PDF
        </a>
      </div>
    </section>
  );
}

export default DownloadBanner;