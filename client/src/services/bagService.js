import api from './api';

export const bagService = {
  // Get all bags with filters, sorting, and pagination
  getBags: async (params) => {
    const response = await api.get('/bags', { params });
    return response.data;
  },

  // Get featured bags
  getFeaturedBags: async () => {
    const response = await api.get('/bags/featured');
    return response.data;
  },

  // Get single bag by ID
  getBagById: async (id) => {
    const response = await api.get(`/bags/${id}`);
    return response.data;
  },

  // Create new bag (admin only)
  createBag: async (bagData) => {
    const formData = new FormData();
    
    // Append bag data
    Object.keys(bagData).forEach(key => {
      if (key === 'images') {
        bagData.images.forEach(image => {
          formData.append('images', image);
        });
      } else if (key === 'variants') {
        formData.append('variants', JSON.stringify(bagData.variants));
      } else {
        formData.append(key, bagData[key]);
      }
    });

    const response = await api.post('/bags', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Update bag (admin only)
  updateBag: async (id, bagData) => {
    const formData = new FormData();
    
    // Append bag data
    Object.keys(bagData).forEach(key => {
      if (key === 'images') {
        bagData.images.forEach(image => {
          formData.append('images', image);
        });
      } else if (key === 'variants') {
        formData.append('variants', JSON.stringify(bagData.variants));
      } else {
        formData.append(key, bagData[key]);
      }
    });

    const response = await api.put(`/bags/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Delete bag (admin only)
  deleteBag: async (id) => {
    const response = await api.delete(`/bags/${id}`);
    return response.data;
  },

  // Add rating and review
  addRating: async (bagId, ratingData) => {
    const response = await api.post(`/bags/${bagId}/ratings`, ratingData);
    return response.data;
  },

  // Get bag ratings
  getBagRatings: async (bagId) => {
    const response = await api.get(`/bags/${bagId}/ratings`);
    return response.data;
  },

  // Update bag stock (admin only)
  updateStock: async (bagId, variantId, quantity) => {
    const response = await api.put(`/bags/${bagId}/stock`, {
      variantId,
      quantity
    });
    return response.data;
  },

  // Search bags
  searchBags: async (query) => {
    const response = await api.get('/bags/search', {
      params: { query }
    });
    return response.data;
  },

  // Get bag categories
  getCategories: async () => {
    const response = await api.get('/bags/categories');
    return response.data;
  },

  // Get bag brands
  getBrands: async () => {
    const response = await api.get('/bags/brands');
    return response.data;
  },

  // Get bag colors
  getColors: async () => {
    const response = await api.get('/bags/colors');
    return response.data;
  },

  // Get bag sizes
  getSizes: async () => {
    const response = await api.get('/bags/sizes');
    return response.data;
  }
};

export default bagService;
