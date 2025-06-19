// src/shared/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? 'http://localhost:5000/api/' : "/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add JWT token to all requests if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
