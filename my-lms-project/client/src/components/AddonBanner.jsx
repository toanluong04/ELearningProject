// src/components/AddonBanner.jsx
import React from 'react';
// We'll use more react-icons
import { FaPuzzlePiece, FaGraduationCap, FaShoppingCart, FaCreditCard, FaEnvelope } from 'react-icons/fa';

function AddonBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">GrowCourse Add-ons</h2>
        <p className="text-lg text-gray-700 mb-10">
          Supercharge your online-school with our powerful add-ons.
        </p>
        {/* Icons Grid */}
        <div className="flex flex-wrap justify-center gap-8">
          <FaPuzzlePiece size={40} className="text-blue-500" />
          <FaGraduationCap size={40} className="text-red-500" />
          <FaShoppingCart size={40} className="text-green-500" />
          <FaCreditCard size={40} className="text-yellow-500" />
          <FaEnvelope size={40} className="text-purple-500" />
        </div>
      </div>
    </section>
  );
}

export default AddonBanner;