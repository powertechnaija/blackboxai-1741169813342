import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  modals: {
    quickView: {
      isOpen: false,
      data: null
    },
    login: {
      isOpen: false
    },
    register: {
      isOpen: false
    },
    cart: {
      isOpen: false
    },
    confirm: {
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null
    }
  },
  globalLoading: false,
  sidebarOpen: false,
  searchOpen: false,
  filterDrawerOpen: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Notification actions
    addNotification: (state, action) => {
      const { id, type, message, duration = 5000 } = action.payload;
      state.notifications.push({
        id,
        type,
        message,
        duration
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },

    // Modal actions
    openModal: (state, action) => {
      const { modalType, data } = action.payload;
      if (state.modals[modalType]) {
        state.modals[modalType].isOpen = true;
        if (data) {
          state.modals[modalType].data = data;
        }
      }
    },
    closeModal: (state, action) => {
      const modalType = action.payload;
      if (state.modals[modalType]) {
        state.modals[modalType].isOpen = false;
        state.modals[modalType].data = null;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modalType => {
        state.modals[modalType].isOpen = false;
        state.modals[modalType].data = null;
      });
    },

    // Confirm dialog actions
    openConfirmDialog: (state, action) => {
      const { title, message, onConfirm } = action.payload;
      state.modals.confirm = {
        isOpen: true,
        title,
        message,
        onConfirm
      };
    },
    closeConfirmDialog: (state) => {
      state.modals.confirm = {
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
      };
    },

    // Loading state
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },

    // Sidebar state
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },

    // Search state
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    closeSearch: (state) => {
      state.searchOpen = false;
    },

    // Filter drawer state
    toggleFilterDrawer: (state) => {
      state.filterDrawerOpen = !state.filterDrawerOpen;
    },
    closeFilterDrawer: (state) => {
      state.filterDrawerOpen = false;
    }
  }
});

export const {
  addNotification,
  removeNotification,
  openModal,
  closeModal,
  closeAllModals,
  openConfirmDialog,
  closeConfirmDialog,
  setGlobalLoading,
  toggleSidebar,
  closeSidebar,
  toggleSearch,
  closeSearch,
  toggleFilterDrawer,
  closeFilterDrawer
} = uiSlice.actions;

// Selectors
export const selectNotifications = (state) => state.ui.notifications;
export const selectModal = (modalType) => (state) => state.ui.modals[modalType];
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSearchOpen = (state) => state.ui.searchOpen;
export const selectFilterDrawerOpen = (state) => state.ui.filterDrawerOpen;

export default uiSlice.reducer;
