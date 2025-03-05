import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: localStorage.getItem('cartItems') 
    ? JSON.parse(localStorage.getItem('cartItems')) 
    : [],
  totalItems: 0,
  totalAmount: 0,
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : null,
  paymentMethod: localStorage.getItem('paymentMethod') || null,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { bag, variant, quantity } = action.payload;
      const existingItem = state.items.find(
        item => item.bag._id === bag._id && 
               item.variant.size === variant.size && 
               item.variant.color === variant.color
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal = existingItem.quantity * existingItem.variant.price;
      } else {
        state.items.push({
          bag,
          variant,
          quantity,
          subtotal: quantity * variant.price
        });
      }

      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + item.subtotal, 0);

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const { bagId, variantSize, variantColor } = action.payload;
      state.items = state.items.filter(
        item => !(item.bag._id === bagId && 
                 item.variant.size === variantSize && 
                 item.variant.color === variantColor)
      );

      // Update totals
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce((total, item) => total + item.subtotal, 0);

      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { bagId, variantSize, variantColor, quantity } = action.payload;
      const item = state.items.find(
        item => item.bag._id === bagId && 
               item.variant.size === variantSize && 
               item.variant.color === variantColor
      );

      if (item) {
        item.quantity = quantity;
        item.subtotal = quantity * item.variant.price;

        // Update totals
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalAmount = state.items.reduce((total, item) => total + item.subtotal, 0);

        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cartItems');
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  saveShippingAddress,
  savePaymentMethod,
  setLoading,
  setError,
  clearError
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;
export const selectShippingAddress = (state) => state.cart.shippingAddress;
export const selectPaymentMethod = (state) => state.cart.paymentMethod;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;
