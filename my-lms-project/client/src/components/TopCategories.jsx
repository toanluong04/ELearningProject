// src/components/TopCategories.jsx
import React from 'react';
import CategoryCard from './CategoryCard';

// Import icons from 'react-icons'
import { FaLaptopCode, FaMobileAlt, FaCogs, FaGamepad } from 'react-icons/fa';

// Mock data for our categories
const categories = [
  { id: 1, name: 'Web App Development', icon: FaLaptopCode },
  { id: 2, name: 'Mobile App Development', icon: FaMobileAlt },
  { id: 3, name: 'Application Development', icon: FaCogs },
  { id: 4, name: 'Game Development', icon: FaGamepad }
];

function TopCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Top Categories
        </h2>
        
        {/* Grid for the category cards */}
        {/* This grid will show 4 columns on desktop, 2 on tablets, and 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map(category => (
            <CategoryCard 
              key={category.id} 
              name={category.name} 
              icon={category.icon} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopCategories;