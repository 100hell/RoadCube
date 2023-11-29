import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const roadcubeSlice = createSlice({
  name: "roadcube",
  initialState,
  reducers: {
    _GET_SETTINGS_DETAILS: (states, action) => {
      states.settingsData = action.payload;
    },
    _GET_SETTINGS_DETAILS_LOADING: (states, action) => {
      states.settingsDataLoading = action.payload || false;
    },
    _UPDATE_SETTINGS_DETAILS_LOADING: (states, action) => {
      if (states.updateSettingsDataLoading) {
        states.updateSettingsDataLoading[action.payload.key] =
          action.payload.loading || false;
      } else {
        states.updateSettingsDataLoading = {
          [action.payload.key]: action.payload.loading,
        };
      }
    },
    _UPDATE_SETTINGS_DETAILS: (states, action) => {
      if (states.settingsData) {
        states.settingsData[action.payload.key] = action.payload.value;
      } else {
        states.settingsData = {
          [action.payload.key]: action.payload.value,
        };
      }
    },
    // Get Products and Customers Count
    _GET_PRODUCTS_SYNC_COUNT_LOADING: (states, action) => {
      states.getProductsSyncCountLoading = action.payload || false;
    },
    _SET_PRODUCTS_SYNC_COUNT: (states, action) => {
      states.getProductsSyncCount = action.payload || null;
    },
    _GET_UPDATES_SYNC_COUNT_LOADING: (states, action) => {
      states.getCustomersSyncCountLoading = action.payload || false;
    },
    _SET_UPDATES_SYNC_COUNT: (states, action) => {
      states.getCustomersSyncCount = action.payload || null;
    },
    // Synced Products and Customers
    _SYNC_PRODUCTS_LOADING: (states, action) => {
      states.syncProductsLoading = action.payload || false;
    },
    _SYNC_CUSTOMERS_LOADING: (states, action) => {
      states.syncCustomersLoading = action.payload || false;
    },
    _DASHBOARD_PAGE_BANNER: (states, action) => {
      states.dashboardPageBannerSuccessErrorMessage = action.payload || null;
    },
    _SETTINGS_PAGE_BANNER: (states, action) => {
      states.settingPageBannerSuccessErrorMessage = action.payload || null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  _GET_SETTINGS_DETAILS,
  _GET_SETTINGS_DETAILS_LOADING,
  _UPDATE_SETTINGS_DETAILS,
  _UPDATE_SETTINGS_DETAILS_LOADING,
  // Get Products and Customers Count
  _GET_PRODUCTS_SYNC_COUNT_LOADING,
  _SET_PRODUCTS_SYNC_COUNT,
  _GET_UPDATES_SYNC_COUNT_LOADING,
  _SET_UPDATES_SYNC_COUNT,
  // Synced Products and Customers
  _SYNC_PRODUCTS_LOADING,
  _SYNC_CUSTOMERS_LOADING,
  _DASHBOARD_PAGE_BANNER,
  _SETTINGS_PAGE_BANNER,
} = roadcubeSlice.actions;
// Sync Products and Customers

export default roadcubeSlice.reducer;
