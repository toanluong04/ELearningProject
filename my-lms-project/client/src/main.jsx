import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext'

// --- Page Components ---
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import CourseDetailPage from './pages/CourseDetailPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx' 
import AdminDashboard from './pages/AdminDashboard.jsx' 
import CoursePlayerPage from './pages/CoursePlayerPage.jsx' 
import CoursesPage from './pages/CoursesPage.jsx'

// --- Special Components ---
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // --- Public Routes ---
      { path: '/', element: <HomePage /> },
      { path: '/course/:id', element: <CourseDetailPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/courses', element: <CoursesPage /> }, 
      
      { path: '/course/:id', element: <CourseDetailPage /> },

      // --- Student Protected Route ---
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )
      },

      // --- Admin Protected Route ---
      {
        path: '/admin',
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },

      // --- 2. NEW LEARNING ROUTE (Player) ---
      // This is where students go to watch the videos
      {
        path: '/learn/:id', 
        element: (
          <ProtectedRoute>
            <CoursePlayerPage />
          </ProtectedRoute>
        )
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="438215360919-r851lj95845rd47jre5jalf70n9sckhu.apps.googleusercontent.com">
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>


);