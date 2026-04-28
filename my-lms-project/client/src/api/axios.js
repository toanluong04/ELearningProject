// src/api/axios.js
import axios from 'axios';

// 1. Create a central instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this ONE line when you deploy to the cloud!
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Add an Interceptor
// This code runs automatically before EVERY request.
// It checks if you have a token and adds it to the headers.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;