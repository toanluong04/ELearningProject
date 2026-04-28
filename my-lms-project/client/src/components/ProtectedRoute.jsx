// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// This component takes 'children' as a prop.
// 'children' will be the page we want to protect (e.g., <DashboardPage />)
function ProtectedRoute({ children }) {
  // NEW: We grab isLoading along with the user
  const { user, isLoading } = useContext(AuthContext);

  // NEW: Wait for AuthContext to finish checking local storage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-blue-500 animate-pulse">
          Verifying session...
        </div>
      </div>
    );
  }

  if (!user) {
    // If the user is NOT logged in, redirect them to the /login page
    return <Navigate to="/login" replace />;
  }

  // If the user IS logged in, show the component they were trying to access
  return children;
}

export default ProtectedRoute;