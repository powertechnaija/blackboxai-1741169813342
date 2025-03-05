import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized responses
      if (error.response.status === 401) {
        store.dispatch(logout());
      }

      // Return error message from the server if available
      throw new Error(
        error.response.data.error || 
        error.response.data.message || 
        'An error occurred'
      );
    }

    // Handle network errors
    if (error.request) {
      throw new Error('Network error. Please check your connection.');
    }

    // Handle other errors
    throw error;
  }
);

export default api;
