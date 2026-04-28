// src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget'; 

function App() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header shows on every page */}
      <Header /> 

      {/* Main content area where different pages (Home, Courses, etc.) render */}
      <main className="flex-grow">
        <Outlet /> 
      </main>

      {/* Footer shows on every page */}
      <Footer /> 

      {/* FEATURE: Real-time Support Chat 
        This is placed outside <main> so it floats on top of everything 
      */}
      <ChatWidget />
    </div>
  );
}

export default App;