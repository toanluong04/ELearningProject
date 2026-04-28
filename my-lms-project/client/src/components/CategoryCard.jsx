// src/components/CategoryCard.jsx
import React from 'react';

// This component will receive an 'icon' (from react-icons) and a 'name'
function CategoryCard({ icon, name }) {
  // 'icon' is passed as a component, so we can render it as a tag
  const IconComponent = icon; 

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3">
        {/* Render the icon component with size and color */}
        <IconComponent size={40} className="text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
    </div>
  );
}

export default CategoryCard;