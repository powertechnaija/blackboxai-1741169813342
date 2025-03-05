import api from './api';

export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Update profile image
  updateProfileImage: async (formData) => {
    const response = await api.put('/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/users/verify-email/${token}`);
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.post(`/users/reset-password/${token}`, { password });
    return response.data;
  },

  // Get user orders
  getUserOrders: async () => {
    const response = await api.get('/users/orders');
    return response.data;
  },

  // Add to wishlist
  addToWishlist: async (bagId) => {
    const response = await api.post('/users/wishlist', { bagId });
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (bagId) => {
    const response = await api.delete(`/users/wishlist/${bagId}`);
    return response.data;
  },

  // Get user wishlist
  getWishlist: async () => {
    const response = await api.get('/users/wishlist');
    return response.data;
  }
};

export default authService;
