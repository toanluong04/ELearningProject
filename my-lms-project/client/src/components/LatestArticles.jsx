// src/components/LatestArticles.jsx
import React from 'react';

// A simple card for the article
const ArticleCard = ({ image, title, excerpt }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-5">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{excerpt}</p>
      <a href="#" className="text-blue-600 font-medium hover:underline">Read More</a>
    </div>
  </div>
);

function LatestArticles() {
  const articles = [
    { id: 1, title: "How to Start an Online Course", excerpt: "A step-by-step guide to creating and selling your first online course...", image: "https://placehold.co/600x400/98dff/white?text=Article+1" },
    { id: 2, title: "E-Learning Trends in 2025", excerpt: "Discover the future of online education and what students are looking for...", image: "https://placehold.co/600x400/ffc107/white?text=Article+2" },
    { id: 3, title: "Top 10 Communication Skills", excerpt: "Master these essential skills to advance in your life and career...", image: "https://placehold.co/600x400/dc3545/white?text=Article+3" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Latest Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(article => (
            <ArticleCard key={article.id} title={article.title} excerpt={article.excerpt} image={article.image} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default LatestArticles;