import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bags: [],
  featuredBags: [],
  currentBag: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    color: '',
    size: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  },
  sortBy: '-createdAt'
};

const bagSlice = createSlice({
  name: 'bags',
  initialState,
  reducers: {
    setBags: (state, action) => {
      state.bags = action.payload;
    },
    setFeaturedBags: (state, action) => {
      state.featuredBags = action.payload;
    },
    setCurrentBag: (state, action) => {
      state.currentBag = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    addRating: (state, action) => {
      const { bagId, rating } = action.payload;
      if (state.currentBag && state.currentBag._id === bagId) {
        state.currentBag.ratings.push(rating);
        // Recalculate average rating
        const sum = state.currentBag.ratings.reduce((acc, r) => acc + r.rating, 0);
        state.currentBag.averageRating = sum / state.currentBag.ratings.length;
      }
    },
    updateBagStock: (state, action) => {
      const { bagId, variantId, quantity } = action.payload;
      const bag = state.bags.find(b => b._id === bagId);
      if (bag) {
        const variant = bag.variants.find(v => v._id === variantId);
        if (variant) {
          variant.stock = quantity;
        }
      }
      if (state.currentBag && state.currentBag._id === bagId) {
        const variant = state.currentBag.variants.find(v => v._id === variantId);
        if (variant) {
          variant.stock = quantity;
        }
      }
    }
  }
});

export const {
  setBags,
  setFeaturedBags,
  setCurrentBag,
  setLoading,
  setError,
  clearError,
  setFilters,
  clearFilters,
  setPagination,
  setSortBy,
  addRating,
  updateBagStock
} = bagSlice.actions;

// Selectors
export const selectAllBags = (state) => state.bags.bags;
export const selectFeaturedBags = (state) => state.bags.featuredBags;
export const selectCurrentBag = (state) => state.bags.currentBag;
export const selectBagLoading = (state) => state.bags.loading;
export const selectBagError = (state) => state.bags.error;
export const selectBagFilters = (state) => state.bags.filters;
export const selectBagPagination = (state) => state.bags.pagination;
export const selectBagSortBy = (state) => state.bags.sortBy;

export default bagSlice.reducer;
