// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Authentication Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  // NEW: Add the isLoading state, defaulting to true so the app waits!
  const [isLoading, setIsLoading] = useState(true);

  // 3. Effect hook to check if a user is already logged in (persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem('user');
      }
    }
    
    // NEW: We finished checking local storage. Tell the app to stop loading!
    setIsLoading(false);
  }, []); 

  /**
   * Login function
   * Expects userData: { user: { id, username, email, role }, token }
   */
  const login = (userData) => {
    if (userData && userData.user && userData.token) {
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('token', userData.token);
      setUser(userData.user);
    }
  };

  /**
   * Logout function
   * Clears local storage and resets state
   */
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    // Redirect to home page on logout
    window.location.href = '/';
  };

  return (
    // NEW: Export isLoading so other components can use it
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;