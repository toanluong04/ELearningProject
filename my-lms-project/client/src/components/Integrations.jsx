// src/components/Integrations.jsx
import React from 'react';

function Integrations() {

  const companies = [
    { name: 'VNG', bg: 'F37021', text: 'FFFFFF' },      // VNG Orange
    { name: 'FPT', bg: '0B3E92', text: 'FFFFFF' },      // FPT Blue
    { name: 'Garena', bg: 'E81C23', text: 'FFFFFF' },   // Garena Red
    { name: 'Viettel', bg: 'EE0033', text: 'FFFFFF' },  // Viettel Red
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Integrations</h2>
        
        <div className="flex flex-wrap justify-center items-center gap-10">
          {companies.map((company, index) => (
            <img 
              key={index}
              // Dynamically inserting the background and text colors into the URL
              src={`https://placehold.co/150x50/${company.bg}/${company.text}?text=${company.name}`} 
              alt={`${company.name} Integration`} 
              className="rounded shadow-sm hover:shadow-md transition-shadow duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Integrations;