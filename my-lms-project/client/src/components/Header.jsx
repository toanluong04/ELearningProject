import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Fixed the import path by adding the .jsx extension for better resolution
import AuthContext from '../context/AuthContext.jsx';

/**
 * Custom Inline SVG Logo (Crocodile)
 * This avoids dependency issues with icon libraries.
 */
const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M232 168C232 185.673 217.673 200 200 200H56C38.3269 200 24 185.673 24 168C24 150.327 38.3269 136 56 136H72V104C72 73.0721 97.0721 48 128 48C158.928 48 184 73.0721 184 104V136H200C217.673 136 232 150.327 232 168Z" fill="#1D4ED8"/>
    <circle cx="108" cy="100" r="8" fill="white"/>
    <circle cx="148" cy="100" r="8" fill="white"/>
    <path d="M100 160H156" stroke="white" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

function Header() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Helper to determine active link styling
  const isActive = (path) => location.pathname === path ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600 font-medium";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-700">
          <LogoIcon />
          <span className="tracking-tight">GrowCourse</span>
        </Link>
        
        {/* Main Navigation */}
        <ul className="hidden md:flex space-x-8">
          <li>
            <Link to="/" className={isActive('/')}>Home</Link>
          </li>
          <li>
            <Link to="/courses" className={isActive('/courses')}>All Courses</Link>
          </li>
          <li>
            <Link to="/aboutus" className={isActive('/aboutus')}>About Us</Link>
          </li>
        </ul>
        
        {/* User Account / Auth Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-4">
              
              {/* Conditional Link: Admin vs Student */}
              {user.role === 'admin' ? (
                <Link 
                  to="/admin" 
                  className="bg-purple-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-purple-700 transition shadow-sm active:scale-95"
                >
                  Admin Panel
                </Link>
              ) : (
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 font-medium hover:text-blue-600 border border-gray-200 px-4 py-2 rounded-lg transition"
                >
                  My Dashboard
                </Link>
              )}

              <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
              
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-bold text-gray-900 leading-none">
                    {user.username}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">
                    {user.role}
                  </span>
                </div>
                
                <button 
                  onClick={logout}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-600 transition active:scale-95 shadow-md shadow-red-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-blue-700 font-bold transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-50 active:scale-95"
              >
                Join for Free
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;